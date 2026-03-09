import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Eye, Loader2 } from "lucide-react";
import useDynamicForm from "./useDynamicForm";

function ServiceValuesForm({ formSchema, onSubmit, onValuesChange }) {
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
    <div className="flex flex-col overflow-hidden rounded-xl border border-base-300 bg-base-100">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-base-300 bg-base-200/50 px-4 py-2.5">
        <Eye size={15} className="text-info" />
        <h2 className="text-sm font-bold tracking-wide">{t("Parameter Form Preview")}</h2>
        {compileLoading && (
          <Loader2 size={14} className="ml-auto animate-spin text-base-content/40" />
        )}
      </div>

      {/* Form body */}
      <div className="flex-1 p-4">
        {!formSchema ? (
          <div className="flex h-32 items-center justify-center text-sm text-base-content/40">
            {t("Fix schema JSON to render the form preview.")}
          </div>
        ) : (
          <div className="max-h-[44vh] overflow-auto pr-1">
            <ServiceValuesForm
              key={previewSchemaKey}
              formSchema={formSchema}
              onSubmit={onSubmit}
              onValuesChange={onValuesChange}
            />
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="border-t border-base-300/50 px-4 py-1.5 text-[11px] text-base-content/35">
        {selectedId
          ? t("Preview Auto Compiles By Stored Service")
          : t("Preview Auto Compiles Unsaved Draft")}
      </div>
    </div>
  );
});

export default FormPreviewPanel;
