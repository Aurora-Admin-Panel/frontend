import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import {
  createDefaultParam,
  getEmitPresetKind,
  normalizeEmitForPreset,
  parseDefaultInputByType,
  prettyJson,
} from "./utils";

const ParamListRow = memo(function ParamListRow({
  param,
  idx,
  isSelected,
  paramsLength,
  setSelectedParamIndex,
  applyDraftMutation,
}) {
  return (
    <div
      className={`rounded-box cursor-pointer border p-2 ${
        isSelected ? "border-primary bg-primary/10" : "border-base-300 bg-base-100"
      }`}
      onClick={() => setSelectedParamIndex(idx)}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setSelectedParamIndex(idx);
        }
      }}
      tabIndex={0}
    >
      <div className="w-full text-left">
        <div className="truncate text-sm font-semibold">{param.label || param.key}</div>
        <div className="truncate text-xs opacity-70">
          {param.key} · {param.type} · {getEmitPresetKind(param)}
        </div>
      </div>
      <div className="mt-2 inline-flex gap-1">
        <button
          type="button"
          className="btn btn-ghost btn-xs"
          onClick={(e) => {
            e.stopPropagation();
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
          onClick={(e) => {
            e.stopPropagation();
            applyDraftMutation((draft) => {
              if (!Array.isArray(draft.params) || idx >= draft.params.length - 1) return;
              [draft.params[idx + 1], draft.params[idx]] = [
                draft.params[idx],
                draft.params[idx + 1],
              ];
            });
            setSelectedParamIndex(Math.min(paramsLength - 1, idx + 1));
          }}
          disabled={idx === paramsLength - 1}
        >
          <ChevronDown size={14} />
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-xs text-error"
          onClick={(e) => {
            e.stopPropagation();
            applyDraftMutation((draft) => {
              if (!Array.isArray(draft.params) || !draft.params[idx]) return;
              draft.params.splice(idx, 1);
            });
            setSelectedParamIndex((prev) => {
              if (paramsLength <= 1) return 0;
              if (prev > idx) return prev - 1;
              return Math.min(prev, paramsLength - 2);
            });
          }}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
});

function FieldGrid({ children, className = "" }) {
  return <div className={`grid grid-cols-1 gap-2 md:grid-cols-2 ${className}`.trim()}>{children}</div>;
}

function FieldBlock({ label, children, className = "" }) {
  return (
    <label className={`form-control w-full ${className}`.trim()}>
      <span className="mb-1 text-xs font-medium opacity-70">{label}</span>
      {children}
    </label>
  );
}

function ToggleField({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between rounded-box border border-base-300 bg-base-200 px-3 py-2">
      <span className="text-xs font-medium opacity-70">{label}</span>
      <input type="checkbox" className="checkbox checkbox-sm" checked={checked} onChange={onChange} />
    </label>
  );
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
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase opacity-70">{t("Params")}</div>
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
            <div className="max-h-72 space-y-2 overflow-auto pr-1">
              {params.map((param, idx) => (
                <ParamListRow
                  key={`${param.key}-${idx}`}
                  param={param}
                  idx={idx}
                  isSelected={idx === selectedParamIndex}
                  paramsLength={params.length}
                  setSelectedParamIndex={setSelectedParamIndex}
                  applyDraftMutation={applyDraftMutation}
                />
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
              <div className="space-y-3 rounded-box border border-base-300 bg-base-100 p-3">
                <FieldGrid>
                  <FieldBlock label={t("Key")}>
                    <input
                      className="input input-bordered input-sm w-full"
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
                  </FieldBlock>
                  <FieldBlock label={t("Label")}>
                    <input
                      className="input input-bordered input-sm w-full"
                      value={selected.label || ""}
                      onChange={(e) =>
                        patchSelected((param) => {
                          param.label = e.target.value;
                        })
                      }
                    />
                  </FieldBlock>
                </FieldGrid>

                <FieldGrid>
                  <FieldBlock label={t("Type")}>
                    <select
                      className="select select-bordered select-sm w-full"
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
                          if (
                            nextType === "bool" &&
                            !["flag", "flagTrue", "env", "arg"].includes(getEmitPresetKind(param))
                          ) {
                            param.emit = {
                              flag: `--${String(param.key || "flag").replaceAll("_", "-")}`,
                            };
                          }
                        })
                      }
                    >
                      {["string", "int", "float", "bool", "enum", "secret", "list", "object"].map(
                        (type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        )
                      )}
                    </select>
                  </FieldBlock>

                  <FieldBlock label={t("Emit Preset")}>
                    <select
                      className="select select-bordered select-sm w-full"
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
                  </FieldBlock>
                </FieldGrid>

                <FieldGrid>
                  <ToggleField
                    label={t("Required")}
                    checked={Boolean(selected.required)}
                    onChange={(e) =>
                      patchSelected((param) => {
                        param.required = e.target.checked;
                      })
                    }
                  />
                  <ToggleField
                    label={t("Secret")}
                    checked={Boolean(selected.secret || selected.type === "secret")}
                    onChange={(e) =>
                      patchSelected((param) => {
                        param.secret = e.target.checked;
                      })
                    }
                  />
                </FieldGrid>

                <div className="space-y-1">
                  <div className="text-xs font-medium opacity-70">{t("Default")}</div>
                  {selected.type === "bool" ? (
                    <ToggleField
                      label={t("Default")}
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
                  <div className="space-y-1">
                    <div className="text-xs font-medium opacity-70">{t("Enum Options Hint")}</div>
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

                <div className="space-y-2 rounded-box border border-base-300 bg-base-200 p-3">
                  <div className="text-xs font-semibold uppercase opacity-70">{t("Emit Config")}</div>
                  {emitPreset === "arg" && (
                    <FieldGrid>
                      <FieldBlock label={t("Arg")}>
                        <input
                          className="input input-bordered input-sm w-full"
                          value={selected.emit?.arg || ""}
                          onChange={(e) =>
                            patchSelected((param) => {
                              param.emit.arg = e.target.value;
                            })
                          }
                        />
                      </FieldBlock>
                      <FieldBlock label={t("Mode (lists only)")}>
                        <select
                          className="select select-bordered select-sm w-full"
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
                      </FieldBlock>
                    </FieldGrid>
                  )}
                  {emitPreset === "flag" && (
                    <FieldBlock label={t("Flag")}>
                      <input
                        className="input input-bordered input-sm w-full"
                        value={selected.emit?.flag || ""}
                        onChange={(e) =>
                          patchSelected((param) => {
                            param.emit.flag = e.target.value;
                          })
                        }
                      />
                    </FieldBlock>
                  )}
                  {emitPreset === "flagTrue" && (
                    <FieldGrid>
                      <FieldBlock label={t("Flag True")}>
                        <input
                          className="input input-bordered input-sm w-full"
                          value={selected.emit?.flagTrue || ""}
                          onChange={(e) =>
                            patchSelected((param) => {
                              param.emit.flagTrue = e.target.value;
                            })
                          }
                        />
                      </FieldBlock>
                      <FieldBlock label={t("Flag False")}>
                        <input
                          className="input input-bordered input-sm w-full"
                          value={selected.emit?.flagFalse || ""}
                          onChange={(e) =>
                            patchSelected((param) => {
                              if (!e.target.value) delete param.emit.flagFalse;
                              else param.emit.flagFalse = e.target.value;
                            })
                          }
                        />
                      </FieldBlock>
                    </FieldGrid>
                  )}
                  {emitPreset === "env" && (
                    <FieldBlock label={t("Env")}>
                      <input
                        className="input input-bordered input-sm w-full"
                        value={selected.emit?.env || ""}
                        onChange={(e) =>
                          patchSelected((param) => {
                            param.emit.env = e.target.value;
                          })
                        }
                      />
                    </FieldBlock>
                  )}
                  {emitPreset === "pos" && (
                    <FieldBlock label={t("Position")}>
                      <input
                        type="number"
                        className="input input-bordered input-sm w-full"
                        value={selected.emit?.pos ?? 0}
                        onChange={(e) =>
                          patchSelected((param) => {
                            param.emit.pos = Number(e.target.value || 0);
                          })
                        }
                      />
                    </FieldBlock>
                  )}
                  {emitPreset === "file" && (
                    <div className="space-y-2">
                      <FieldBlock label={t("Path Template")}>
                        <input
                          className="input input-bordered input-sm w-full"
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
                      </FieldBlock>
                      <FieldGrid className="md:grid-cols-2">
                        <FieldBlock label={t("Format")}>
                          <select
                            className="select select-bordered select-sm w-full"
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
                        </FieldBlock>
                        <FieldBlock label={t("Encoding")}>
                          <input
                            className="input input-bordered input-sm w-full"
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
                        </FieldBlock>
                      </FieldGrid>
                    </div>
                  )}
                  {emitPreset === "stdin" && (
                    <FieldGrid className="md:grid-cols-2">
                      <FieldBlock label={t("Format")}>
                        <select
                          className="select select-bordered select-sm w-full"
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
                      </FieldBlock>
                      <FieldBlock label={t("Encoding")}>
                        <input
                          className="input input-bordered input-sm w-full"
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
                      </FieldBlock>
                    </FieldGrid>
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


export default ParamBuilderPanel;
