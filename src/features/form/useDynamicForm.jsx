import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
export default function useDynamicForm({ schema, onSubmit, onCancel, defaultValues } = {}) {
  const { t } = useTranslation();
  const computedDefaults = defaultValues ?? deriveDefaultValues(schema);
  const methods = useForm({ defaultValues: computedDefaults });
  const { register, control, handleSubmit, formState: { errors }, setValue } = methods;

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
          <div className="col-span-full flex w-full flex-row justify-end space-x-2 mt-2">
            <button className="btn btn-outline btn-accent" type="button" onClick={onCancel}>{t("Cancel")}</button>
            <button className="btn btn-primary" type="submit">{t("Confirm")}</button>
          </div>
        </div>
      </form>
    </div>
  ), [schema, register, control, errors, setValue, handleSubmit, onSubmit]);

  return { form, methods };
}
