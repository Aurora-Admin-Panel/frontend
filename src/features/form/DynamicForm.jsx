import { useEffect, useMemo, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import schemaRaw from "./schema.json?raw";
import useDynamicForm from "./useDynamicForm";
import { authoringContractToDynamicSchema } from "./authoringAdapter";
import DataLoading from "../DataLoading";

// Backward-compatible sample schema used when DynamicForm is rendered with props.
const schema = JSON.parse(schemaRaw);

const LIST_EXECUTABLE_CONTRACTS = gql`
  query ListExecutableContracts($limit: Int, $offset: Int) {
    paginatedExecutableContracts(limit: $limit, offset: $offset) {
      count
      items {
        id
        contractKey
        version
        title
        description
        isActive
        updatedAt
        schemaJson
      }
    }
  }
`;

const CREATE_EXECUTABLE_CONTRACT = gql`
  mutation CreateExecutableContract($schemaJson: JSON!) {
    createExecutableContract(schemaJson: $schemaJson) {
      id
      contractKey
      version
      title
      description
      isActive
      updatedAt
      schemaJson
    }
  }
`;

const UPDATE_EXECUTABLE_CONTRACT = gql`
  mutation UpdateExecutableContract($id: Int!, $schemaJson: JSON!, $isActive: Boolean) {
    updateExecutableContract(id: $id, schemaJson: $schemaJson, isActive: $isActive)
  }
`;

const COMPILE_EXECUTABLE_CONTRACT_PREVIEW = gql`
  mutation CompileExecutableContractPreview($contract: JSON!, $values: JSON!, $context: JSON) {
    compileExecutableContractPreview(contract: $contract, values: $values, context: $context)
  }
`;

const COMPILE_EXECUTABLE_CONTRACT_PREVIEW_BY_ID = gql`
  mutation CompileExecutableContractPreviewById($id: Int!, $values: JSON!, $context: JSON) {
    compileExecutableContractPreviewById(id: $id, values: $values, context: $context)
  }
`;

const DEFAULT_CONTRACT_TEMPLATE = {
  schemaVersion: "exec-authoring/v1",
  contractKey: "demo_contract",
  version: 1,
  title: "Demo Contract",
  description: "Edit this contract and save it.",
  exec: {
    bin: "/usr/bin/echo",
    baseArgs: ["hello"],
    timeoutSeconds: 300,
  },
  ui: {
    grid: {
      cols: { base: 1, md: 12 },
      gap: 4,
    },
  },
  params: [
    {
      key: "name",
      type: "string",
      label: "Name",
      required: true,
      ui: {
        grid: { colSpan: { base: 12, md: 6 } },
      },
      emit: { arg: "--name" },
    },
    {
      key: "verbose",
      type: "bool",
      label: "Verbose",
      default: false,
      ui: {
        grid: { colSpan: { base: 12, md: 6 } },
      },
      emit: { flag: "--verbose" },
    },
  ],
};

function prettyJson(value) {
  return JSON.stringify(value, null, 2);
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function createDefaultParam(index = 0) {
  return {
    key: `param_${index + 1}`,
    type: "string",
    label: `Param ${index + 1}`,
    required: false,
    ui: {
      grid: { colSpan: { base: 12, md: 6 } },
    },
    emit: { arg: `--param-${index + 1}` },
  };
}

function getEmitPresetKind(param) {
  const emit = param?.emit || {};
  if (emit.pos !== undefined && emit.pos !== null) return "pos";
  if (emit.arg !== undefined && emit.arg !== null) return "arg";
  if (emit.flag !== undefined && emit.flag !== null) return "flag";
  if (emit.flagTrue !== undefined && emit.flagTrue !== null) return "flagTrue";
  if (emit.env !== undefined && emit.env !== null) return "env";
  if (emit.file) return "file";
  if (emit.stdin) return "stdin";
  return "arg";
}

function normalizeEmitForPreset(prevEmit = {}, preset, key = "param") {
  switch (preset) {
    case "pos":
      return { pos: prevEmit.pos ?? 0 };
    case "arg":
      return {
        arg: prevEmit.arg ?? `--${String(key).replaceAll("_", "-")}`,
        ...(prevEmit.mode ? { mode: prevEmit.mode } : {}),
      };
    case "flag":
      return { flag: prevEmit.flag ?? `--${String(key).replaceAll("_", "-")}` };
    case "flagTrue":
      return {
        flagTrue: prevEmit.flagTrue ?? `--${String(key).replaceAll("_", "-")}`,
        ...(prevEmit.flagFalse ? { flagFalse: prevEmit.flagFalse } : {}),
      };
    case "env":
      return { env: prevEmit.env ?? String(key).toUpperCase() };
    case "file":
      return {
        file: {
          pathTemplate:
            prevEmit.file?.pathTemplate ??
            `/tmp/aurora/{{jobId}}-${String(key).replaceAll("_", "-")}.json`,
          format: prevEmit.file?.format ?? "json",
          encoding: prevEmit.file?.encoding ?? "utf-8",
        },
      };
    case "stdin":
      return {
        stdin: {
          format: prevEmit.stdin?.format ?? "raw",
          encoding: prevEmit.stdin?.encoding ?? "utf-8",
        },
      };
    default:
      return prevEmit;
  }
}

function parseDefaultInputByType(type, rawValue) {
  if (rawValue === "" || rawValue === null || rawValue === undefined) return undefined;
  if (type === "int") {
    const n = Number(rawValue);
    return Number.isFinite(n) ? Math.trunc(n) : rawValue;
  }
  if (type === "float") {
    const n = Number(rawValue);
    return Number.isFinite(n) ? n : rawValue;
  }
  if (type === "bool") {
    return Boolean(rawValue);
  }
  if (type === "list" || type === "object") {
    try {
      return JSON.parse(rawValue);
    } catch (_) {
      return rawValue;
    }
  }
  return rawValue;
}

function ContractValuesForm({ formSchema, onSubmit }) {
  const { form } = useDynamicForm({
    schema: formSchema,
    onSubmit,
    onCancel: () => {},
  });
  return form;
}

function LegacyDynamicForm({ schema: schemaProp, onSubmit }) {
  const { form } = useDynamicForm({
    schema: schemaProp || schema,
    onSubmit: onSubmit || ((data) => console.log(data)),
    onCancel: () => console.log("cancel"),
  });
  return <div className="mx-auto px-10">{form}</div>;
}

function ParamBuilderPanel({
  contract,
  selectedParamIndex,
  setSelectedParamIndex,
  applyDraftMutation,
}) {
  const { t } = useTranslation();
  const params = Array.isArray(contract?.params) ? contract.params : [];
  const execConfig = contract?.exec || {};
  const selected = params[selectedParamIndex] ?? null;
  const emitPreset = selected ? getEmitPresetKind(selected) : "arg";

  const patchContract = (fn) => {
    applyDraftMutation((draft) => {
      fn(draft);
    });
  };

  const patchSelected = (fn) => {
    if (selectedParamIndex == null || selectedParamIndex < 0) return;
    applyDraftMutation((draft) => {
      if (!Array.isArray(draft.params) || !draft.params[selectedParamIndex]) return;
      if (!draft.params[selectedParamIndex].emit) {
        draft.params[selectedParamIndex].emit = normalizeEmitForPreset(
          {},
          "arg",
          draft.params[selectedParamIndex].key
        );
      }
      fn(draft.params[selectedParamIndex], draft);
    });
  };

  const patchExec = (fn) => {
    applyDraftMutation((draft) => {
      if (!draft.exec || typeof draft.exec !== "object") {
        draft.exec = { bin: "", baseArgs: [], timeoutSeconds: 300 };
      }
      if (!Array.isArray(draft.exec.baseArgs)) {
        draft.exec.baseArgs = [];
      }
      fn(draft.exec, draft);
    });
  };

  return (
    <div className="card bg-base-200 shadow-md">
      <div className="card-body gap-3 p-4">
        <div className="flex items-center justify-between">
          <h2 className="card-title text-base">{t("Builder (v1)")}</h2>
          <button
            type="button"
            className="btn btn-primary btn-xs"
            onClick={() => {
              applyDraftMutation((draft) => {
                if (!Array.isArray(draft.params)) draft.params = [];
                draft.params.push(createDefaultParam(draft.params.length));
              });
              setSelectedParamIndex(params.length);
            }}
          >
            <Plus size={14} />
            {t("Add Param")}
          </button>
        </div>

        <div className="rounded-box border border-base-300 bg-base-100 p-3">
          <div className="mb-2 text-xs font-semibold uppercase opacity-70">
            {t("Contract")}
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <label className="input input-bordered input-sm w-full md:col-span-2">
              <span className="text-xs opacity-70">{t("Title")}</span>
              <input
                className="grow"
                value={contract?.title || ""}
                onChange={(e) =>
                  patchContract((draft) => {
                    draft.title = e.target.value;
                  })
                }
              />
            </label>

            <label className="input input-bordered input-sm w-full">
              <span className="text-xs opacity-70">{t("Contract Key")}</span>
              <input
                className="grow font-mono"
                value={contract?.contractKey || ""}
                onChange={(e) =>
                  patchContract((draft) => {
                    draft.contractKey = e.target.value;
                  })
                }
              />
            </label>

            <label className="input input-bordered input-sm w-full">
              <span className="text-xs opacity-70">{t("Version")}</span>
              <input
                type="number"
                className="grow"
                value={contract?.version ?? 1}
                min={1}
                onChange={(e) =>
                  patchContract((draft) => {
                    const next = Number(e.target.value || 1);
                    draft.version = Number.isFinite(next) && next > 0 ? Math.trunc(next) : 1;
                  })
                }
              />
            </label>

            <div className="md:col-span-2">
              <div className="mb-1 text-xs opacity-70">{t("Description")}</div>
              <textarea
                className="textarea textarea-bordered textarea-sm w-full text-xs"
                rows={2}
                value={contract?.description || ""}
                onChange={(e) =>
                  patchContract((draft) => {
                    if (!e.target.value.trim()) delete draft.description;
                    else draft.description = e.target.value;
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="rounded-box border border-base-300 bg-base-100 p-3">
          <div className="mb-2 text-xs font-semibold uppercase opacity-70">
            {t("Exec (command prefix)")}
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <label className="input input-bordered input-sm w-full md:col-span-2">
              <span className="text-xs opacity-70">{t("Binary")}</span>
              <input
                className="grow"
                value={execConfig.bin || ""}
                onChange={(e) =>
                  patchExec((exec) => {
                    exec.bin = e.target.value;
                  })
                }
              />
            </label>

            <label className="input input-bordered input-sm w-full">
              <span className="text-xs opacity-70">{t("Working Directory")}</span>
              <input
                className="grow"
                value={execConfig.workingDir || ""}
                placeholder={t("Working Directory Placeholder")}
                onChange={(e) =>
                  patchExec((exec) => {
                    if (!e.target.value) delete exec.workingDir;
                    else exec.workingDir = e.target.value;
                  })
                }
              />
            </label>

            <label className="input input-bordered input-sm w-full">
              <span className="text-xs opacity-70">{t("Timeout Seconds")}</span>
              <input
                type="number"
                className="grow"
                value={execConfig.timeoutSeconds ?? ""}
                onChange={(e) =>
                  patchExec((exec) => {
                    if (e.target.value === "") delete exec.timeoutSeconds;
                    else exec.timeoutSeconds = Number(e.target.value);
                  })
                }
              />
            </label>

            <div className="md:col-span-2">
              <div className="mb-1 text-xs opacity-70">{t("Base Args (one per line)")}</div>
              <textarea
                className="textarea textarea-bordered textarea-sm w-full font-mono text-xs"
                rows={3}
                value={Array.isArray(execConfig.baseArgs) ? execConfig.baseArgs.join("\n") : ""}
                onChange={(e) =>
                  patchExec((exec) => {
                    exec.baseArgs = e.target.value
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean);
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 2xl:grid-cols-2">
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase opacity-70">{t("Params")}</div>
            <div className="max-h-72 space-y-2 overflow-auto pr-1">
              {params.map((param, idx) => (
                <div
                  key={`${param.key}-${idx}`}
                  className={`rounded-box border p-2 ${
                    idx === selectedParamIndex
                      ? "border-primary bg-primary/10"
                      : "border-base-300 bg-base-100"
                  }`}
                >
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => setSelectedParamIndex(idx)}
                  >
                    <div className="truncate text-sm font-semibold">{param.label || param.key}</div>
                    <div className="truncate text-xs opacity-70">
                      {param.key} · {param.type} · {getEmitPresetKind(param)}
                    </div>
                  </button>
                  <div className="mt-2 flex gap-1">
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs"
                      onClick={() => {
                        applyDraftMutation((draft) => {
                          if (!Array.isArray(draft.params) || idx <= 0) return;
                          [draft.params[idx - 1], draft.params[idx]] = [
                            draft.params[idx],
                            draft.params[idx - 1],
                          ];
                        });
                        setSelectedParamIndex(Math.max(0, idx - 1));
                      }}
                      disabled={idx === 0}
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs"
                      onClick={() => {
                        applyDraftMutation((draft) => {
                          if (!Array.isArray(draft.params) || idx >= draft.params.length - 1) return;
                          [draft.params[idx + 1], draft.params[idx]] = [
                            draft.params[idx],
                            draft.params[idx + 1],
                          ];
                        });
                        setSelectedParamIndex(Math.min(params.length - 1, idx + 1));
                      }}
                      disabled={idx === params.length - 1}
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs text-error"
                      onClick={() => {
                        applyDraftMutation((draft) => {
                          if (!Array.isArray(draft.params) || !draft.params[idx]) return;
                          draft.params.splice(idx, 1);
                        });
                        setSelectedParamIndex((prev) => {
                          if (params.length <= 1) return 0;
                          if (prev > idx) return prev - 1;
                          return Math.min(prev, params.length - 2);
                        });
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {params.length === 0 && (
                <div className="text-sm opacity-70">{t("No params yet. Add one to start.")}</div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase opacity-70">{t("Selected Param")}</div>
            {!selected ? (
              <div className="rounded-box border border-base-300 bg-base-100 p-3 text-sm opacity-70">
                {t("Select a param to edit.")}
              </div>
            ) : (
              <div className="space-y-2 rounded-box border border-base-300 bg-base-100 p-3">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <label className="input input-bordered input-sm w-full">
                    <span className="text-xs opacity-70">{t("Key")}</span>
                    <input
                      className="grow"
                      value={selected.key || ""}
                      onChange={(e) =>
                        patchSelected((param) => {
                          param.key = e.target.value;
                          param.label = param.label || e.target.value;
                          param.emit = normalizeEmitForPreset(
                            param.emit || {},
                            getEmitPresetKind(param),
                            e.target.value || param.key
                          );
                        })
                      }
                    />
                  </label>
                  <label className="input input-bordered input-sm w-full">
                    <span className="text-xs opacity-70">{t("Label")}</span>
                    <input
                      className="grow"
                      value={selected.label || ""}
                      onChange={(e) =>
                        patchSelected((param) => {
                          param.label = e.target.value;
                        })
                      }
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <label className="form-control">
                    <span className="mb-1 text-xs opacity-70">{t("Type")}</span>
                    <select
                      className="select select-bordered select-sm"
                      value={selected.type || "string"}
                      onChange={(e) =>
                        patchSelected((param) => {
                          const nextType = e.target.value;
                          param.type = nextType;
                          if (nextType === "enum" && !Array.isArray(param.options)) {
                            param.options = [{ value: "option1", label: "Option 1" }];
                          }
                          if (nextType !== "enum") delete param.options;
                          if (nextType === "list" && !param.items) {
                            param.items = {
                              key: `${param.key || "item"}_item`,
                              type: "string",
                              label: "Item",
                            };
                          }
                          if (nextType !== "list") delete param.items;
                          if (nextType === "object" && !Array.isArray(param.properties)) {
                            param.properties = [
                              {
                                key: "field1",
                                type: "string",
                                label: "Field 1",
                              },
                            ];
                          }
                          if (nextType !== "object") delete param.properties;
                          if (nextType === "secret") {
                            param.secret = true;
                            param.ui = { ...(param.ui || {}), widget: "password" };
                          }
                          if (nextType === "bool" && !["flag", "flagTrue", "env", "arg"].includes(getEmitPresetKind(param))) {
                            param.emit = { flag: `--${String(param.key || "flag").replaceAll("_", "-")}` };
                          }
                        })
                      }
                    >
                      {["string", "int", "float", "bool", "enum", "secret", "list", "object"].map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="form-control">
                    <span className="mb-1 text-xs opacity-70">{t("Emit Preset")}</span>
                    <select
                      className="select select-bordered select-sm"
                      value={emitPreset}
                      onChange={(e) =>
                        patchSelected((param) => {
                          param.emit = normalizeEmitForPreset(param.emit || {}, e.target.value, param.key);
                        })
                      }
                    >
                      <option value="arg">{t("Arg Preset Label")}</option>
                      <option value="flag">{t("Flag Preset Label")}</option>
                      <option value="flagTrue">{t("Flag Pair Preset Label")}</option>
                      <option value="env">{t("Env Preset Label")}</option>
                      <option value="pos">{t("Positional Preset Label")}</option>
                      <option value="file">{t("File Preset Label")}</option>
                      <option value="stdin">{t("Stdin Preset Label")}</option>
                    </select>
                  </label>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <label className="label cursor-pointer gap-2 p-0">
                    <span className="label-text">{t("Required")}</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={Boolean(selected.required)}
                      onChange={(e) =>
                        patchSelected((param) => {
                          param.required = e.target.checked;
                        })
                      }
                    />
                  </label>
                  <label className="label cursor-pointer gap-2 p-0">
                    <span className="label-text">{t("Secret")}</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={Boolean(selected.secret || selected.type === "secret")}
                      onChange={(e) =>
                        patchSelected((param) => {
                          param.secret = e.target.checked;
                        })
                      }
                    />
                  </label>
                </div>

                <div>
                  <div className="mb-1 text-xs opacity-70">{t("Default")}</div>
                  {selected.type === "bool" ? (
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={Boolean(selected.default)}
                      onChange={(e) =>
                        patchSelected((param) => {
                          param.default = e.target.checked;
                        })
                      }
                    />
                  ) : (
                    <textarea
                      className="textarea textarea-bordered textarea-sm w-full font-mono text-xs"
                      rows={selected.type === "object" || selected.type === "list" ? 3 : 2}
                      value={
                        selected.default === undefined
                          ? ""
                          : typeof selected.default === "object"
                            ? prettyJson(selected.default)
                            : String(selected.default)
                      }
                      onChange={(e) =>
                        patchSelected((param) => {
                          const parsed = parseDefaultInputByType(param.type, e.target.value);
                          if (parsed === undefined) delete param.default;
                          else param.default = parsed;
                        })
                      }
                    />
                  )}
                </div>

                {selected.type === "enum" && (
                  <div>
                    <div className="mb-1 text-xs opacity-70">
                      {t("Enum Options Hint")}
                    </div>
                    <textarea
                      className="textarea textarea-bordered textarea-sm w-full font-mono text-xs"
                      rows={4}
                      value={(selected.options || [])
                        .map((opt) =>
                          typeof opt === "object"
                            ? `${opt.value}${opt.label ? ` | ${opt.label}` : ""}`
                            : String(opt)
                        )
                        .join("\n")}
                      onChange={(e) =>
                        patchSelected((param) => {
                          param.options = e.target.value
                            .split("\n")
                            .map((line) => line.trim())
                            .filter(Boolean)
                            .map((line) => {
                              const [value, label] = line.split("|").map((x) => x?.trim());
                              return label ? { value, label } : { value, label: value };
                            });
                        })
                      }
                    />
                  </div>
                )}

                <div className="rounded-box border border-base-300 bg-base-200 p-2">
                  <div className="mb-1 text-xs opacity-70">{t("Emit Config")}</div>
                  {emitPreset === "arg" && (
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <label className="input input-bordered input-sm">
                        <span className="text-xs opacity-70">{t("Arg")}</span>
                        <input
                          className="grow"
                          value={selected.emit?.arg || ""}
                          onChange={(e) =>
                            patchSelected((param) => {
                              param.emit.arg = e.target.value;
                            })
                          }
                        />
                      </label>
                      <label className="form-control">
                        <span className="mb-1 text-xs opacity-70">{t("Mode (lists only)")}</span>
                        <select
                          className="select select-bordered select-sm"
                          value={selected.emit?.mode || "repeat"}
                          onChange={(e) =>
                            patchSelected((param) => {
                              if (e.target.value === "repeat") delete param.emit.mode;
                              else param.emit.mode = e.target.value;
                            })
                          }
                        >
                          <option value="repeat">repeat</option>
                          <option value="csv">csv</option>
                        </select>
                      </label>
                    </div>
                  )}
                  {emitPreset === "flag" && (
                    <label className="input input-bordered input-sm w-full">
                      <span className="text-xs opacity-70">{t("Flag")}</span>
                      <input
                        className="grow"
                        value={selected.emit?.flag || ""}
                        onChange={(e) =>
                          patchSelected((param) => {
                            param.emit.flag = e.target.value;
                          })
                        }
                      />
                    </label>
                  )}
                  {emitPreset === "flagTrue" && (
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <label className="input input-bordered input-sm">
                        <span className="text-xs opacity-70">{t("Flag True")}</span>
                        <input
                          className="grow"
                          value={selected.emit?.flagTrue || ""}
                          onChange={(e) =>
                            patchSelected((param) => {
                              param.emit.flagTrue = e.target.value;
                            })
                          }
                        />
                      </label>
                      <label className="input input-bordered input-sm">
                        <span className="text-xs opacity-70">{t("Flag False")}</span>
                        <input
                          className="grow"
                          value={selected.emit?.flagFalse || ""}
                          onChange={(e) =>
                            patchSelected((param) => {
                              if (!e.target.value) delete param.emit.flagFalse;
                              else param.emit.flagFalse = e.target.value;
                            })
                          }
                        />
                      </label>
                    </div>
                  )}
                  {emitPreset === "env" && (
                    <label className="input input-bordered input-sm w-full">
                      <span className="text-xs opacity-70">{t("Env")}</span>
                      <input
                        className="grow"
                        value={selected.emit?.env || ""}
                        onChange={(e) =>
                          patchSelected((param) => {
                            param.emit.env = e.target.value;
                          })
                        }
                      />
                    </label>
                  )}
                  {emitPreset === "pos" && (
                    <label className="input input-bordered input-sm w-full">
                      <span className="text-xs opacity-70">{t("Position")}</span>
                      <input
                        type="number"
                        className="grow"
                        value={selected.emit?.pos ?? 0}
                        onChange={(e) =>
                          patchSelected((param) => {
                            param.emit.pos = Number(e.target.value || 0);
                          })
                        }
                      />
                    </label>
                  )}
                  {emitPreset === "file" && (
                    <div className="space-y-2">
                      <label className="input input-bordered input-sm w-full">
                        <span className="text-xs opacity-70">{t("Path Template")}</span>
                        <input
                          className="grow"
                          value={selected.emit?.file?.pathTemplate || ""}
                          onChange={(e) =>
                            patchSelected((param) => {
                              param.emit.file = {
                                ...(param.emit.file || {}),
                                pathTemplate: e.target.value,
                              };
                            })
                          }
                        />
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          className="select select-bordered select-sm"
                          value={selected.emit?.file?.format || "json"}
                          onChange={(e) =>
                            patchSelected((param) => {
                              param.emit.file = {
                                ...(param.emit.file || {}),
                                format: e.target.value,
                              };
                            })
                          }
                        >
                          <option value="json">json</option>
                          <option value="raw">raw</option>
                        </select>
                        <input
                          className="input input-bordered input-sm"
                          value={selected.emit?.file?.encoding || "utf-8"}
                          onChange={(e) =>
                            patchSelected((param) => {
                              param.emit.file = {
                                ...(param.emit.file || {}),
                                encoding: e.target.value,
                              };
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                  {emitPreset === "stdin" && (
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        className="select select-bordered select-sm"
                        value={selected.emit?.stdin?.format || "raw"}
                        onChange={(e) =>
                          patchSelected((param) => {
                            param.emit.stdin = {
                              ...(param.emit.stdin || {}),
                              format: e.target.value,
                            };
                          })
                        }
                      >
                        <option value="raw">raw</option>
                        <option value="json">json</option>
                      </select>
                      <input
                        className="input input-bordered input-sm"
                        value={selected.emit?.stdin?.encoding || "utf-8"}
                        onChange={(e) =>
                          patchSelected((param) => {
                            param.emit.stdin = {
                              ...(param.emit.stdin || {}),
                              encoding: e.target.value,
                            };
                          })
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExecutableContractWorkbench() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { contractId } = useParams();
  const [selectedId, setSelectedId] = useState(null);
  const [selectedParamIndex, setSelectedParamIndex] = useState(0);
  const [editorText, setEditorText] = useState(prettyJson(DEFAULT_CONTRACT_TEMPLATE));
  const [saveMessage, setSaveMessage] = useState("");
  const [lastValues, setLastValues] = useState(null);
  const [compileResult, setCompileResult] = useState(null);

  const { data, loading, error, refetch } = useQuery(LIST_EXECUTABLE_CONTRACTS, {
    variables: { limit: 100, offset: 0 },
    fetchPolicy: "network-only",
  });
  const [createContract, { loading: createLoading }] = useMutation(CREATE_EXECUTABLE_CONTRACT);
  const [updateContract, { loading: updateLoading }] = useMutation(UPDATE_EXECUTABLE_CONTRACT);
  const [compileDraft, { loading: compileDraftLoading }] = useMutation(
    COMPILE_EXECUTABLE_CONTRACT_PREVIEW
  );
  const [compileById, { loading: compileByIdLoading }] = useMutation(
    COMPILE_EXECUTABLE_CONTRACT_PREVIEW_BY_ID
  );

  const parseState = useMemo(() => {
    try {
      const parsed = JSON.parse(editorText);
      return { parsed, parseError: null };
    } catch (e) {
      return { parsed: null, parseError: String(e) };
    }
  }, [editorText]);

  const adaptedFormState = useMemo(() => {
    if (!parseState.parsed) return { schema: null, error: null };
    try {
      return {
        schema: authoringContractToDynamicSchema(parseState.parsed),
        error: null,
      };
    } catch (e) {
      return {
        schema: null,
        error: String(e),
      };
    }
  }, [parseState]);

  const contracts = data?.paginatedExecutableContracts?.items ?? [];
  const routeContractId = contractId ? Number(contractId) : null;

  useEffect(() => {
    if (!routeContractId || Number.isNaN(routeContractId)) {
      return;
    }
    const item = contracts.find((contract) => Number(contract.id) === routeContractId);
    if (!item) {
      return;
    }
    setSelectedId(item.id);
    setEditorText(prettyJson(item.schemaJson));
    setSelectedParamIndex(0);
    setSaveMessage("");
    setCompileResult(null);
  }, [routeContractId, contracts]);

  const applyDraftMutation = (mutator) => {
    if (!parseState.parsed) return;
    const next = cloneJson(parseState.parsed);
    if (!Array.isArray(next.params)) next.params = [];
    mutator(next);
    setEditorText(prettyJson(next));
    setCompileResult(null);
  };

  const handleSelectContract = (item) => {
    navigate(`/app/contracts/builder/${item.id}`);
  };

  const handleNew = () => {
    navigate("/app/contracts/builder");
    setSelectedId(null);
    setEditorText(prettyJson(DEFAULT_CONTRACT_TEMPLATE));
    setSelectedParamIndex(0);
    setSaveMessage("");
    setCompileResult(null);
  };

  const handleSaveNew = async () => {
    setSaveMessage("");
    if (!parseState.parsed) {
      setSaveMessage("Cannot save invalid JSON.");
      return;
    }
    try {
      const res = await createContract({
        variables: { schemaJson: parseState.parsed },
      });
      const created = res?.data?.createExecutableContract;
      if (created?.id) {
        setSelectedId(created.id);
        setEditorText(prettyJson(created.schemaJson));
        setSaveMessage(`Created contract #${created.id}`);
        await refetch();
        navigate(`/app/contracts/builder/${created.id}`);
      } else {
        setSaveMessage("Create failed.");
      }
    } catch (e) {
      setSaveMessage(String(e?.message || e));
    }
  };

  const handleUpdate = async () => {
    setSaveMessage("");
    if (!selectedId) {
      setSaveMessage("Select or create a contract first.");
      return;
    }
    if (!parseState.parsed) {
      setSaveMessage("Cannot update invalid JSON.");
      return;
    }
    try {
      const res = await updateContract({
        variables: {
          id: Number(selectedId),
          schemaJson: parseState.parsed,
        },
      });
      if (res?.data?.updateExecutableContract) {
        setSaveMessage(`Updated contract #${selectedId}`);
        await refetch();
      } else {
        setSaveMessage(`Update failed for #${selectedId}`);
      }
    } catch (e) {
      setSaveMessage(String(e?.message || e));
    }
  };

  const handleCompileFromForm = async (values) => {
    setLastValues(values);
    try {
      if (selectedId) {
        const res = await compileById({
          variables: {
            id: Number(selectedId),
            values,
            context: { jobId: "preview-ui" },
          },
        });
        setCompileResult(res?.data?.compileExecutableContractPreviewById ?? null);
        return;
      }
      if (!parseState.parsed) {
        setCompileResult({ ok: false, error: "Invalid contract JSON" });
        return;
      }
      const res = await compileDraft({
        variables: {
          contract: parseState.parsed,
          values,
          context: { jobId: "preview-ui" },
        },
      });
      setCompileResult(res?.data?.compileExecutableContractPreview ?? null);
    } catch (e) {
      setCompileResult({ ok: false, error: String(e?.message || e) });
    }
  };

  const compileLoading = compileDraftLoading || compileByIdLoading;
  const saveLoading = createLoading || updateLoading;

  if (error) {
    return (
      <div className="px-6 py-4">
        <div className="alert alert-error">
          <span>{String(error.message || error)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-4 px-4 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("Schema Builder")}</h1>
          <p className="text-sm opacity-70">
            Build authoring schema JSON, render a parameter form, and compile a preview.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm" onClick={handleNew} type="button">
            {t("New")}
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleSaveNew}
            type="button"
            disabled={saveLoading}
          >
            {createLoading ? t("Saving") : t("Save New")}
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleUpdate}
            type="button"
            disabled={saveLoading || !selectedId}
          >
            {updateLoading ? t("Updating") : t("Update")}
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="alert alert-info py-2">
          <span>{saveMessage}</span>
        </div>
      )}

      {!parseState.parseError && parseState.parsed && (
        <ParamBuilderPanel
          contract={parseState.parsed}
          selectedParamIndex={selectedParamIndex}
          setSelectedParamIndex={setSelectedParamIndex}
          applyDraftMutation={applyDraftMutation}
        />
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="card bg-base-200 shadow-md xl:col-span-7">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <h2 className="card-title text-base">{t("Authoring Schema JSON")}</h2>
              <div className="text-xs opacity-70">
                {selectedId ? `#${selectedId}` : t("Unsaved Draft")}
              </div>
            </div>
            <textarea
              className="textarea textarea-bordered h-[70vh] w-full font-mono text-xs"
              value={editorText}
              onChange={(e) => {
                setEditorText(e.target.value);
                setCompileResult(null);
              }}
              spellCheck={false}
            />
            {parseState.parseError && (
              <div className="mt-2 rounded-box border border-error/30 bg-error/10 p-2 text-xs text-error">
                JSON parse error: {parseState.parseError}
              </div>
            )}
            {!parseState.parseError && adaptedFormState.error && (
              <div className="mt-2 rounded-box border border-warning/30 bg-warning/10 p-2 text-xs text-warning">
                Form adapter error: {adaptedFormState.error}
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-5 flex flex-col gap-4">
          <div className="card bg-base-200 shadow-md">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <h2 className="card-title text-base">{t("Parameter Form Preview")}</h2>
                {compileLoading ? <DataLoading height={24} width={24} /> : null}
              </div>
              {!adaptedFormState.schema ? (
                <div className="text-sm opacity-70">
                  {t("Fix schema JSON to render the form preview.")}
                </div>
              ) : (
                <div className="max-h-[44vh] overflow-auto pr-1">
                  <ContractValuesForm
                    key={JSON.stringify(adaptedFormState.schema)}
                    formSchema={adaptedFormState.schema}
                    onSubmit={handleCompileFromForm}
                  />
                </div>
              )}
              <div className="text-xs opacity-70">
                {selectedId
                  ? "Submit compiles using stored contract via compilePreviewById."
                  : "Submit compiles the unsaved draft directly."}
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-md">
            <div className="card-body p-4">
              <h2 className="card-title text-base">{t("Compile Preview Output")}</h2>
              <div className="max-h-[28vh] overflow-auto rounded-box bg-base-300 p-2">
                <pre className="whitespace-pre-wrap break-all text-xs">
                  {compileResult
                    ? prettyJson(compileResult)
                    : lastValues
                      ? t("No compile result yet")
                      : t("Submit the parameter form to compile a preview")}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DynamicForm = ({ schema: schemaProp, onSubmit }) => {
  // Legacy mode: render the old dynamic form if a schema prop is provided.
  if (schemaProp) {
    return <LegacyDynamicForm schema={schemaProp} onSubmit={onSubmit} />;
  }

  return <ExecutableContractWorkbench />;
};

export default DynamicForm;
