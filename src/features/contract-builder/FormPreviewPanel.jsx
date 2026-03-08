import { memo } from "react";
import { useTranslation } from "react-i18next";
import DataLoading from "../DataLoading";
import useDynamicForm from "./useDynamicForm";

function ContractValuesForm({ formSchema, onSubmit, onValuesChange }) {
  const { form } = useDynamicForm({
    schema: formSchema,
    onSubmit,
    onValuesChange,
  });

  return form;
}

const FormPreviewPanel = memo(function FormPreviewPanel({
  formSchema,
  previewSchemaKey,
  selectedId,
  compileLoading,
  onSubmit,
  onValuesChange,
}) {
  const { t } = useTranslation();
  return (
    <div className="card bg-base-200 shadow-md">
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          <h2 className="card-title text-base">{t("Parameter Form Preview")}</h2>
          {compileLoading ? <DataLoading height={24} width={24} /> : null}
        </div>
        {!formSchema ? (
          <div className="text-sm opacity-70">{t("Fix schema JSON to render the form preview.")}</div>
        ) : (
          <div className="max-h-[44vh] overflow-auto pr-1">
            <ContractValuesForm
              key={previewSchemaKey}
              formSchema={formSchema}
              onSubmit={onSubmit}
              onValuesChange={onValuesChange}
            />
          </div>
        )}
        <div className="text-xs opacity-70">
          {selectedId
            ? t("Preview Auto Compiles By Stored Contract")
            : t("Preview Auto Compiles Unsaved Draft")}
        </div>
      </div>
    </div>
  );
});

export default FormPreviewPanel;
