import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Code2 } from "lucide-react";

const AuthoringJsonPanel = memo(function AuthoringJsonPanel({
  selectedId,
  editorText,
  setEditorText,
  parseError,
  adapterError,
  setCompileResult,
}) {
  const { t } = useTranslation();

  const lineCount = editorText.split("\n").length;

  return (
    <div className="xl:col-span-6 flex flex-col overflow-hidden rounded-xl border border-base-300 bg-base-200">
      {/* Header bar */}
      <div className="flex items-center gap-2 border-b border-base-300 px-4 py-2.5">
        <Code2 size={15} className="text-primary" />
        <h2 className="text-sm font-bold tracking-wide">{t("Authoring Schema JSON")}</h2>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-[11px] tabular-nums text-base-content/40">{lineCount} lines</span>
          <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
            selectedId
              ? "bg-primary/10 text-primary"
              : "bg-base-content/5 text-base-content/50"
          }`}>
            {selectedId ? `#${selectedId}` : t("Unsaved Draft")}
          </span>
        </div>
      </div>

      {/* Editor area */}
      <div className="relative flex-1">
        <textarea
          className="h-[70vh] w-full resize-none bg-base-300/40 p-4 font-mono text-[13px] leading-relaxed text-base-content/90 outline-none placeholder:text-base-content/20"
          value={editorText}
          onChange={(e) => {
            setEditorText(e.target.value);
            setCompileResult(null);
          }}
          spellCheck={false}
        />
      </div>

      {/* Error strip */}
      {parseError && (
        <div className="border-t-2 border-error/40 bg-error/5 px-4 py-2 text-xs text-error">
          JSON parse error: {parseError}
        </div>
      )}
      {!parseError && adapterError && (
        <div className="border-t-2 border-warning/40 bg-warning/5 px-4 py-2 text-xs text-warning">
          Form adapter error: {adapterError}
        </div>
      )}
    </div>
  );
});

export default AuthoringJsonPanel;
