import { memo } from "react";
import { useTranslation } from "react-i18next";

const AuthoringJsonPanel = memo(function AuthoringJsonPanel({
  selectedId,
  editorText,
  setEditorText,
  parseError,
  adapterError,
  setCompileResult,
}) {
  const { t } = useTranslation();
  return (
    <div className="card bg-base-200 shadow-md xl:col-span-6">
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          <h2 className="card-title text-base">{t("Authoring Schema JSON")}</h2>
          <div className="text-xs opacity-70">{selectedId ? `#${selectedId}` : t("Unsaved Draft")}</div>
        </div>
        <textarea
          className="textarea textarea-bordered h-[70vh] w-full font-mono text-xs"
          value={editorText}
          onChange={(e) => {
            setEditorText(e.target.value);
            setCompileResult(null);
          }}
          spellCheck={false}
        />
        {parseError && (
          <div className="mt-2 rounded-box border border-error/30 bg-error/10 p-2 text-xs text-error">
            JSON parse error: {parseError}
          </div>
        )}
        {!parseError && adapterError && (
          <div className="mt-2 rounded-box border border-warning/30 bg-warning/10 p-2 text-xs text-warning">
            Form adapter error: {adapterError}
          </div>
        )}
      </div>
    </div>
  );
});

export default AuthoringJsonPanel;
