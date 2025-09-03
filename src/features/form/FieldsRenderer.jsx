import TextField from "./TextField";
import SelectField from "./SelectField";
import CheckboxField from "./CheckboxField";
import ObjectField from "./ObjectField";
import ListField from "./ListField";
import { normalizeValidation } from "./utils";

function buildColSpanClasses(gridCfg) {
  if (!gridCfg) return "col-span-12"; // default full row on small screens
  const span = gridCfg.colSpan || {};
  const parts = [];
  const add = (bp, n) => {
    if (!n) return;
    const pref = bp === "base" ? "" : `${bp}:`;
    parts.push(`${pref}col-span-${n}`);
  };
  add("base", span.base || 12);
  add("sm", span.sm);
  add("md", span.md);
  add("lg", span.lg);
  add("xl", span.xl);
  add("2xl", span["2xl"]);
  return parts.join(" ");
}

const FieldsRenderer = ({ schema, parent = null, register, control, errors, setValue }) => {
  return (
    <>
      {Object.entries(schema)
        .filter(([key]) => !key.startsWith("$"))
        .map(([key, field]) => {
        const name = parent ? `${parent}.${key}` : key;
        const wrapperClass = buildColSpanClasses(field.grid);
        switch (field.type) {
          case "text":
          case "email":
          case "number":
          case "password":
            return (
              <TextField
                key={name}
                control={control}
                errors={errors}
                name={name}
                label={field.label}
                type={field.type}
                rules={normalizeValidation(field.validation)}
                className={wrapperClass}
              />
            );
          case "select":
            return (
              <SelectField
                key={name}
                register={register}
                errors={errors}
                name={name}
                label={field.label}
                options={field.options || []}
                rules={normalizeValidation(field.validation)}
                className={wrapperClass}
              />
            );
          case "checkbox":
            return (
              <CheckboxField
                key={name}
                register={register}
                errors={errors}
                name={name}
                label={field.label}
                rules={normalizeValidation(field.validation)}
                className={wrapperClass}
              />
            );
          case "object":
            return (
              <ObjectField
                key={name}
                schema={field.of}
                parent={parent}
                register={register}
                control={control}
                errors={errors}
                setValue={setValue}
                name={key}
                label={field.label}
                className={wrapperClass}
              />
            );
          case "list":
            return (
              <ListField
                key={name}
                name={key}
                label={field.label}
                itemSchema={field.values}
                parent={parent}
                register={register}
                control={control}
                errors={errors}
                setValue={setValue}
                className={wrapperClass}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
};

export default FieldsRenderer;
