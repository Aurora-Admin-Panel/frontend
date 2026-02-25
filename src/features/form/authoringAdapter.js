function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function toSelectOptions(options) {
  return ensureArray(options).map((opt) => {
    if (opt && typeof opt === "object" && "value" in opt) {
      return {
        value: opt.value,
        label: opt.label ?? String(opt.value),
      };
    }
    return {
      value: opt,
      label: String(opt),
    };
  });
}

function buildValidation(param) {
  const validation = { ...(param?.validation || {}) };
  if (param?.required && validation.required === undefined) {
    validation.required = `${param.label || param.key || "Field"} is required`;
  }
  return Object.keys(validation).length ? validation : undefined;
}

function mapParamToDynamicField(param) {
  if (!param || typeof param !== "object") {
    throw new Error("Invalid param definition");
  }

  const base = {
    label: param.label || param.key,
    grid: param.ui?.grid,
    validation: buildValidation(param),
  };

  switch (param.type) {
    case "string":
      return {
        ...base,
        type: param.ui?.widget === "email" ? "email" : "text",
        defaultValue: param.default ?? "",
      };
    case "secret":
      return {
        ...base,
        type: "password",
        defaultValue: param.default ?? "",
      };
    case "int":
    case "float":
      return {
        ...base,
        type: "number",
        defaultValue: param.default ?? "",
      };
    case "bool":
      return {
        ...base,
        type: "checkbox",
        defaultValue: param.default ?? false,
      };
    case "enum":
      return {
        ...base,
        type: "select",
        options: toSelectOptions(param.options),
        defaultValue:
          param.default ??
          (Array.isArray(param.options) && param.options.length
            ? (param.options[0]?.value ?? param.options[0])
            : ""),
      };
    case "list":
      return {
        ...base,
        type: "list",
        defaultValue: param.default ?? [],
        values: mapParamToDynamicField({
          ...(param.items || { type: "string", label: "Item" }),
          key: `${param.key || "item"}_item`,
        }),
      };
    case "object": {
      const nested = authoringParamsToDynamicSchema(param.properties || []);
      return {
        ...base,
        type: "object",
        defaultValue: param.default,
        of: nested,
      };
    }
    default:
      throw new Error(`Unsupported param type for form renderer: ${param.type}`);
  }
}

export function authoringParamsToDynamicSchema(params) {
  const out = {};
  for (const param of ensureArray(params)) {
    if (!param?.key) continue;
    out[param.key] = mapParamToDynamicField(param);
  }
  return out;
}

export function authoringContractToDynamicSchema(contract) {
  if (!contract || typeof contract !== "object") {
    throw new Error("Contract must be an object");
  }
  if (!Array.isArray(contract.params)) {
    throw new Error("Contract params must be an array");
  }

  const schema = authoringParamsToDynamicSchema(contract.params);
  if (contract.ui?.grid) {
    schema.$grid = contract.ui.grid;
  }
  return schema;
}

