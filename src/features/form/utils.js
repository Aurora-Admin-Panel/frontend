export function normalizeValidation(rules) {
  if (!rules) return undefined;
  const out = { ...rules };
  // Normalize pattern: allow string or { value: string, flags, message }
  if (typeof out.pattern === "string") {
    out.pattern = new RegExp(out.pattern);
  } else if (out.pattern && typeof out.pattern.value === "string") {
    try {
      out.pattern = {
        ...out.pattern,
        value: new RegExp(out.pattern.value, out.pattern.flags || undefined),
      };
    } catch (_) {
      // If invalid regex, drop to avoid runtime errors
      delete out.pattern;
    }
  }
  return out;
}

export function deriveDefaultValues(schema) {
  const out = {};
  if (!schema) return out;
  for (const [key, field] of Object.entries(schema)) {
    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "number": {
        out[key] = field.defaultValue ?? "";
        break;
      }
      case "select": {
        const fallback = Array.isArray(field.options) && field.options.length > 0 ? field.options[0].value : "";
        out[key] = field.defaultValue ?? fallback;
        break;
      }
      case "checkbox": {
        out[key] = field.defaultValue ?? false;
        break;
      }
      case "list": {
        out[key] = field.defaultValue ?? [];
        break;
      }
      case "object": {
        out[key] = deriveDefaultValues(field.of || {});
        break;
      }
      default: {
        out[key] = field.defaultValue;
      }
    }
  }
  return out;
}
