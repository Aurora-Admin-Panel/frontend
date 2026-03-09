import { memo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ChevronUp, ChevronDown, Layers, Cpu, FolderDown, Sliders } from "lucide-react";
import {
  createDefaultParam,
  getEmitPresetKind,
  joinArgPrefix,
  normalizeEmitForPreset,
  parseDefaultInputByType,
  prettyJson,
  splitArgPrefix,
} from "./builderUtils";

/* ── Accent system ────────────────────────────────────
   Each section gets a left-border accent for identity */
const sectionAccents = {
  service: "border-l-primary",
  exec: "border-l-secondary",
  source: "border-l-accent",
  params: "border-l-info",
};

/* ── Shared primitives ─────────────────────────────── */

function SectionHeader({ icon: Icon, label, accent }) {
  return (
    <div className="flex items-center gap-2 pb-2">
      {Icon && <Icon size={14} className={accent === "primary" ? "text-primary" : accent === "secondary" ? "text-secondary" : accent === "accent" ? "text-accent" : "text-info"} />}
      <span className="text-[11px] font-bold uppercase tracking-widest text-base-content/50">{label}</span>
    </div>
  );
}

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
      className={`group cursor-pointer rounded-lg border-l-[3px] p-2.5 transition-all duration-150 ${
        isSelected
          ? "border-l-primary bg-primary/8 shadow-sm"
          : "border-l-transparent bg-base-100 hover:bg-base-200/60"
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
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{param.label || param.key}</div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-base-content/40">
            <code className="font-mono">{param.key}</code>
            <span>·</span>
            <span className="rounded bg-base-content/5 px-1 py-px">{param.type}</span>
            <span>·</span>
            <span>{getEmitPresetKind(param)}</span>
          </div>
        </div>

        <div className="ml-2 flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100"
          style={isSelected ? { opacity: 1 } : undefined}
        >
          <button
            type="button"
            className="btn btn-ghost btn-xs btn-square"
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
            <ChevronUp size={13} />
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-xs btn-square"
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
            <ChevronDown size={13} />
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-xs btn-square text-error/60 hover:text-error"
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
            <Trash2 size={13} />
          </button>
        </div>
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
      <span className="mb-1 text-[11px] font-medium text-base-content/45">{label}</span>
      {children}
    </label>
  );
}

function ToggleField({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between rounded-lg bg-base-200/60 px-3 py-2 transition-colors hover:bg-base-200">
      <span className="text-xs font-medium text-base-content/60">{label}</span>
      <input type="checkbox" className="toggle toggle-sm toggle-primary" checked={checked} onChange={onChange} />
    </label>
  );
}

/* ── Section wrapper ─────────────────────────────── */
function BuilderSection({ accent, icon, label, children }) {
  return (
    <div className={`rounded-xl border border-base-300 border-l-[3px] ${accent} bg-base-100 p-4`}>
      <SectionHeader icon={icon} label={label} accent={accent.replace("border-l-", "")} />
      {children}
    </div>
  );
}

/* ── Main Component ─────────────────────────────── */

function ParamEditorPanel({
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

  const patchExecSource = (fn) => {
    applyDraftMutation((draft) => {
      if (!draft.exec || typeof draft.exec !== "object") {
        draft.exec = { bin: "", baseArgs: [], timeoutSeconds: 300 };
      }
      fn(draft.exec, draft);
    });
  };

  const sourceConfig = execConfig.source || null;
  const sourceType = sourceConfig?.type || "none";

  return (
    <div className="overflow-hidden rounded-xl border border-base-300 bg-base-200">
      {/* Panel header */}
      <div className="flex items-center gap-2 border-b border-base-300 px-5 py-3">
        <Sliders size={16} className="text-primary" />
        <h2 className="text-base font-bold tracking-tight">{t("Builder (v1)")}</h2>
      </div>

      <div className="space-y-4 p-5">
        {/* ── Service Metadata ─────────────────────────── */}
        <BuilderSection accent={sectionAccents.service} icon={Layers} label={t("Service")}>
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
              <span className="text-xs opacity-70">{t("Service Key")}</span>
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
              <div className="mb-1 text-[11px] text-base-content/45">{t("Description")}</div>
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

          <label className="mt-2 flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="toggle toggle-sm toggle-primary"
              checked={contract?.requiresPort !== false}
              onChange={(e) =>
                patchContract((draft) => {
                  draft.requiresPort = e.target.checked;
                })
              }
            />
            <span className="text-xs font-medium">{t("Requires Port")}</span>
            <span className="text-[11px] text-base-content/35">
              {"— "}
              {t("{{port}} available in baseArgs, defaults & file templates")}
            </span>
          </label>
        </BuilderSection>

        {/* ── Exec Configuration ───────────────────────── */}
        <BuilderSection accent={sectionAccents.exec} icon={Cpu} label={t("Exec (command prefix)")}>
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
              <div className="mb-1 text-[11px] text-base-content/45">{t("Base Args (one per line)")}</div>
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
        </BuilderSection>

        {/* ── Source Configuration ──────────────────────── */}
        <BuilderSection accent={sectionAccents.source} icon={FolderDown} label={t("Source (binary acquisition)")}>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <FieldBlock label={t("Source Type")} className="md:col-span-2">
              <select
                className="select select-bordered select-sm w-full"
                value={sourceType}
                onChange={(e) =>
                  patchExecSource((exec) => {
                    if (e.target.value === "none") {
                      delete exec.source;
                    } else {
                      exec.source = { type: e.target.value };
                    }
                  })
                }
              >
                <option value="none">{t("None (uploaded file)")}</option>
                <option value="github">{t("GitHub Release")}</option>
                <option value="url">{t("URL Download")}</option>
                <option value="package">{t("Package Manager")}</option>
                <option value="upload">{t("Upload (explicit)")}</option>
              </select>
            </FieldBlock>

            {sourceType === "github" && (
              <>
                <label className="input input-bordered input-sm w-full md:col-span-2">
                  <span className="text-xs opacity-70">{t("Repository")}</span>
                  <input
                    className="grow font-mono"
                    placeholder="owner/repo"
                    value={sourceConfig?.repo || ""}
                    onChange={(e) =>
                      patchExecSource((exec) => {
                        if (!e.target.value) delete exec.source.repo;
                        else exec.source.repo = e.target.value;
                      })
                    }
                  />
                </label>
                <label className="input input-bordered input-sm w-full md:col-span-2">
                  <span className="text-xs opacity-70">{t("Asset Pattern")}</span>
                  <input
                    className="grow font-mono"
                    placeholder="binary-*-linux-{arch}.tar.gz"
                    value={sourceConfig?.assetPattern || ""}
                    onChange={(e) =>
                      patchExecSource((exec) => {
                        if (!e.target.value) delete exec.source.assetPattern;
                        else exec.source.assetPattern = e.target.value;
                      })
                    }
                  />
                </label>
                <label className="input input-bordered input-sm w-full">
                  <span className="text-xs opacity-70">{t("Tag")}</span>
                  <input
                    className="grow font-mono"
                    placeholder="latest"
                    value={sourceConfig?.tag || ""}
                    onChange={(e) =>
                      patchExecSource((exec) => {
                        if (!e.target.value) delete exec.source.tag;
                        else exec.source.tag = e.target.value;
                      })
                    }
                  />
                </label>
                <label className="input input-bordered input-sm w-full">
                  <span className="text-xs opacity-70">{t("Extract Path")}</span>
                  <input
                    className="grow font-mono"
                    placeholder="path/to/binary"
                    value={sourceConfig?.extractPath || ""}
                    onChange={(e) =>
                      patchExecSource((exec) => {
                        if (!e.target.value) delete exec.source.extractPath;
                        else exec.source.extractPath = e.target.value;
                      })
                    }
                  />
                </label>
                <label className="input input-bordered input-sm w-full">
                  <span className="text-xs opacity-70">{t("Strip Components")}</span>
                  <input
                    type="number"
                    className="grow"
                    min={0}
                    value={sourceConfig?.strip ?? ""}
                    onChange={(e) =>
                      patchExecSource((exec) => {
                        if (e.target.value === "") delete exec.source.strip;
                        else exec.source.strip = Number(e.target.value);
                      })
                    }
                  />
                </label>
              </>
            )}

            {sourceType === "url" && (
              <>
                <label className="input input-bordered input-sm w-full md:col-span-2">
                  <span className="text-xs opacity-70">{t("URL")}</span>
                  <input
                    className="grow font-mono"
                    placeholder="https://..."
                    value={sourceConfig?.url || ""}
                    onChange={(e) =>
                      patchExecSource((exec) => {
                        if (!e.target.value) delete exec.source.url;
                        else exec.source.url = e.target.value;
                      })
                    }
                  />
                </label>
                <div className="md:col-span-2">
                  <div className="mb-1 text-[11px] text-base-content/45">{t("Arch-specific URLs")}</div>
                  <div className="space-y-1">
                    {["x86_64", "aarch64", "armv7l"].map((arch) => (
                      <label key={arch} className="input input-bordered input-sm w-full">
                        <span className="text-xs font-mono opacity-70">{arch}</span>
                        <input
                          className="grow font-mono"
                          placeholder="https://..."
                          value={sourceConfig?.arch?.[arch] || ""}
                          onChange={(e) =>
                            patchExecSource((exec) => {
                              if (!e.target.value) {
                                if (exec.source.arch) delete exec.source.arch[arch];
                                if (exec.source.arch && !Object.values(exec.source.arch).some(Boolean)) delete exec.source.arch;
                              } else {
                                if (!exec.source.arch) exec.source.arch = {};
                                exec.source.arch[arch] = e.target.value;
                              }
                            })
                          }
                        />
                      </label>
                    ))}
                  </div>
                  <div className="mt-1 text-[11px] text-base-content/30">{t("Provide either a single URL or arch-specific URLs")}</div>
                </div>
                <label className="input input-bordered input-sm w-full">
                  <span className="text-xs opacity-70">{t("Extract Path")}</span>
                  <input
                    className="grow font-mono"
                    placeholder="path/to/binary"
                    value={sourceConfig?.extractPath || ""}
                    onChange={(e) =>
                      patchExecSource((exec) => {
                        if (!e.target.value) delete exec.source.extractPath;
                        else exec.source.extractPath = e.target.value;
                      })
                    }
                  />
                </label>
                <label className="input input-bordered input-sm w-full">
                  <span className="text-xs opacity-70">{t("Strip Components")}</span>
                  <input
                    type="number"
                    className="grow"
                    min={0}
                    value={sourceConfig?.strip ?? ""}
                    onChange={(e) =>
                      patchExecSource((exec) => {
                        if (e.target.value === "") delete exec.source.strip;
                        else exec.source.strip = Number(e.target.value);
                      })
                    }
                  />
                </label>
              </>
            )}

            {sourceType === "package" && (
              <label className="input input-bordered input-sm w-full md:col-span-2">
                <span className="text-xs opacity-70">{t("Package Name")}</span>
                <input
                  className="grow font-mono"
                  placeholder="nginx"
                  value={sourceConfig?.packageName || ""}
                  onChange={(e) =>
                    patchExecSource((exec) => {
                      if (!e.target.value) delete exec.source.packageName;
                      else exec.source.packageName = e.target.value;
                    })
                  }
                />
              </label>
            )}

            {sourceType === "upload" && (
              <div className="md:col-span-2 text-xs text-base-content/40">
                {t("Binary will be provided via file upload")}
              </div>
            )}
          </div>
        </BuilderSection>

        {/* ── Params ───────────────────────────────────── */}
        <div className={`rounded-xl border border-base-300 border-l-[3px] ${sectionAccents.params} bg-base-100 p-4`}>
          <div className="flex items-center justify-between pb-3">
            <SectionHeader icon={Sliders} label={t("Params")} accent="info" />
            <button
              type="button"
              className="btn btn-primary btn-xs gap-1"
              onClick={() => {
                applyDraftMutation((draft) => {
                  if (!Array.isArray(draft.params)) draft.params = [];
                  draft.params.push(createDefaultParam(draft.params.length));
                });
                setSelectedParamIndex(params.length);
              }}
            >
              <Plus size={13} />
              {t("Add Param")}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
            {/* Param list */}
            <div className="space-y-1.5">
              <div className="max-h-80 space-y-1 overflow-auto pr-1">
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
                  <div className="flex h-20 items-center justify-center text-sm text-base-content/30">
                    {t("No params yet. Add one to start.")}
                  </div>
                )}
              </div>
            </div>

            {/* Selected param editor */}
            <AnimatePresence mode="wait">
              {!selected ? (
                <motion.div
                  key="no-selection"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-20 items-center justify-center rounded-xl bg-base-200/40 text-sm text-base-content/30"
                >
                  {t("Select a param to edit.")}
                </motion.div>
              ) : (
                <motion.div
                  key={`param-${selectedParamIndex}`}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-3 rounded-xl border border-base-300 bg-base-200/30 p-4"
                >
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
                              const prev = splitArgPrefix(param.emit?.flag);
                              const prefix = prev.name ? prev.prefix : "--";
                              param.emit = {
                                flag: joinArgPrefix(prefix, String(param.key || "flag").replaceAll("_", "-")),
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

                  {selected.type === "string" && (
                    <FieldGrid>
                      <FieldBlock label={t("Widget")}>
                        <select
                          className="select select-bordered select-sm w-full"
                          value={selected.ui?.widget === "textarea" ? "textarea" : selected.ui?.widget === "email" ? "email" : "text"}
                          onChange={(e) =>
                            patchSelected((param) => {
                              const w = e.target.value;
                              if (w === "text") {
                                if (param.ui) {
                                  delete param.ui.widget;
                                  if (!Object.keys(param.ui).length) delete param.ui;
                                }
                              } else {
                                if (!param.ui) param.ui = {};
                                param.ui.widget = w;
                              }
                            })
                          }
                        >
                          <option value="text">text</option>
                          <option value="textarea">textarea</option>
                          <option value="email">email</option>
                        </select>
                      </FieldBlock>
                    </FieldGrid>
                  )}

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
                    <div className="text-[11px] font-medium text-base-content/45">{t("Default")}</div>
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
                      <div className="text-[11px] font-medium text-base-content/45">{t("Enum Options Hint")}</div>
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

                  {/* Emit Config */}
                  <div className="space-y-2 rounded-lg border border-base-300 bg-base-200/50 p-3">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-base-content/40">{t("Emit Config")}</div>
                    {emitPreset === "arg" && (
                      <FieldGrid>
                        <FieldBlock label={t("Arg")}>
                          <div className="join w-full">
                            <select
                              className="join-item select select-bordered select-sm w-20"
                              value={splitArgPrefix(selected.emit?.arg).prefix}
                              onChange={(e) =>
                                patchSelected((param) => {
                                  const { name } = splitArgPrefix(param.emit.arg);
                                  param.emit.arg = joinArgPrefix(e.target.value, name);
                                })
                              }
                            >
                              <option value="--">--</option>
                              <option value="-">-</option>
                            </select>
                            <input
                              className="join-item input input-bordered input-sm min-w-0 flex-1"
                              value={splitArgPrefix(selected.emit?.arg).name}
                              onChange={(e) =>
                                patchSelected((param) => {
                                  const { prefix } = splitArgPrefix(param.emit.arg);
                                  param.emit.arg = joinArgPrefix(prefix, e.target.value);
                                })
                              }
                            />
                          </div>
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
                        <div className="join w-full">
                          <select
                            className="join-item select select-bordered select-sm w-20"
                            value={splitArgPrefix(selected.emit?.flag).prefix}
                            onChange={(e) =>
                              patchSelected((param) => {
                                const { name } = splitArgPrefix(param.emit.flag);
                                param.emit.flag = joinArgPrefix(e.target.value, name);
                              })
                            }
                          >
                            <option value="--">--</option>
                            <option value="-">-</option>
                          </select>
                          <input
                            className="join-item input input-bordered input-sm min-w-0 flex-1"
                            value={splitArgPrefix(selected.emit?.flag).name}
                            onChange={(e) =>
                              patchSelected((param) => {
                                const { prefix } = splitArgPrefix(param.emit.flag);
                                param.emit.flag = joinArgPrefix(prefix, e.target.value);
                              })
                            }
                          />
                        </div>
                      </FieldBlock>
                    )}
                    {emitPreset === "flagTrue" && (
                      <FieldGrid>
                        <FieldBlock label={t("Flag True")}>
                          <div className="join w-full">
                            <select
                              className="join-item select select-bordered select-sm w-20"
                              value={splitArgPrefix(selected.emit?.flagTrue).prefix}
                              onChange={(e) =>
                                patchSelected((param) => {
                                  const { name } = splitArgPrefix(param.emit.flagTrue);
                                  param.emit.flagTrue = joinArgPrefix(e.target.value, name);
                                })
                              }
                            >
                              <option value="--">--</option>
                              <option value="-">-</option>
                            </select>
                            <input
                              className="join-item input input-bordered input-sm min-w-0 flex-1"
                              value={splitArgPrefix(selected.emit?.flagTrue).name}
                              onChange={(e) =>
                                patchSelected((param) => {
                                  const { prefix } = splitArgPrefix(param.emit.flagTrue);
                                  param.emit.flagTrue = joinArgPrefix(prefix, e.target.value);
                                })
                              }
                            />
                          </div>
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}


export default ParamEditorPanel;
