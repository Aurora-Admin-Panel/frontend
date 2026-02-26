import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import FieldsRenderer from "./FieldsRenderer";
import { deriveDefaultValues } from "./utils";

function buildGridContainerClasses(gridCfg) {
  const cols = gridCfg?.cols || {};
  const gap = gridCfg?.gap ?? 4;
  const parts = ["grid", `gap-${gap}`];
  const addCols = (bp, n) => {
    if (!n) return;
    const pref = bp === "base" ? "" : `${bp}:`;
    parts.push(`${pref}grid-cols-${n}`);
  };
  addCols("base", cols.base || 1);
  addCols("sm", cols.sm);
  addCols("md", cols.md);
  addCols("lg", cols.lg);
  addCols("xl", cols.xl);
  addCols("2xl", cols["2xl"]);
  return parts.join(" ");
}

// Hook to generate a dynamic form from a JSON schema
// Usage:
//   const { form, methods } = useDynamicForm({ schema, onSubmit, defaultValues });
//   return form;
export default function useDynamicForm({
  schema,
  onSubmit,
  defaultValues,
  onValuesChange,
} = {}) {
  const computedDefaults = defaultValues ?? deriveDefaultValues(schema);
  const methods = useForm({ defaultValues: computedDefaults });
  const { register, control, handleSubmit, formState: { errors }, setValue } = methods;

  useEffect(() => {
    if (!onValuesChange) return undefined;

    onValuesChange(methods.getValues(), { type: "init" });
    const subscription = methods.watch((values, meta) => {
      onValuesChange(values, meta);
    });

    return () => subscription?.unsubscribe?.();
  }, [methods, onValuesChange]);

  const form = useMemo(() => (
    <div className="w-full">
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div
          className={buildGridContainerClasses(schema?.$grid)}
        >
          <FieldsRenderer
            schema={schema}
            register={register}
            control={control}
            errors={errors}
            setValue={setValue}
          />
        </div>
      </form>
    </div>
  ), [schema, register, control, errors, setValue, handleSubmit, onSubmit]);

  return { form, methods };
}
