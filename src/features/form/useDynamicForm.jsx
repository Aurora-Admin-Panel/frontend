import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import FieldsRenderer from "./FieldsRenderer";
import { deriveDefaultValues } from "./utils";

// Hook to generate a dynamic form from a JSON schema
// Usage:
//   const { form, methods } = useDynamicForm({ schema, onSubmit, defaultValues });
//   return form;
export default function useDynamicForm({ schema, onSubmit, defaultValues } = {}) {
  const { t } = useTranslation();
  const computedDefaults = defaultValues ?? deriveDefaultValues(schema);
  const methods = useForm({ defaultValues: computedDefaults });
  const { register, control, handleSubmit, formState: { errors }, setValue } = methods;

  const form = useMemo(() => (
    <div className="flex w-full flex-col space-y-2 items-center justify-center">
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex w-full flex-col items-center space-y-2">
          <FieldsRenderer
            schema={schema}
            register={register}
            control={control}
            errors={errors}
            setValue={setValue}
          />
          <div className="flex w-full max-w-xs flex-row justify-end space-x-2 mt-2">
            <button className="btn btn-outline btn-accent" type="cancel">{t("Cancel")}</button>
            <button className="btn btn-primary" type="submit">{t("Confirm")}</button>
          </div>
        </div>
      </form>
    </div>
  ), [schema, register, control, errors, setValue, handleSubmit, onSubmit]);

  return { form, methods };
}
