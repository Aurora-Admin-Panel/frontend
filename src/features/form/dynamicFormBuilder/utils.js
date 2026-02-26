export function prettyJson(value) {
  return JSON.stringify(value, null, 2);
}

export function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

export function createDefaultParam(index = 0) {
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

export function getEmitPresetKind(param) {
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

export function normalizeEmitForPreset(prevEmit = {}, preset, key = "param") {
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

export function parseDefaultInputByType(type, rawValue) {
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
