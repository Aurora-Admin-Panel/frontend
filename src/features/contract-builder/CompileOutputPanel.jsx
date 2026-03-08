import { memo } from "react";
import { useTranslation } from "react-i18next";

function CompileOutputSectionTitle({ children }) {
  return <div className="text-[11px] font-semibold uppercase opacity-70">{children}</div>;
}

function CompileSummaryBadge({ children }) {
  return <span className="badge badge-ghost badge-sm">{children}</span>;
}

function CompileOutputEmptyState({ lastValues, t }) {
  return (
    <div className="text-xs opacity-70">
      {lastValues ? t("No compile result yet") : t("Preview Auto Updates While Editing")}
    </div>
  );
}

function CompileOutputErrorState({ compileResult }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-2 text-xs">
      <div className="font-semibold text-error">{t("Compile Failed")}</div>
      <div className="whitespace-pre-wrap break-words">
        {compileResult?.error || t("Unknown Compile Error")}
      </div>
      {Array.isArray(compileResult?.details) && compileResult.details.length > 0 ? (
        <div className="space-y-1">
          <div className="font-medium opacity-70">
            {t("Compile Validation Details Count", { count: compileResult.details.length })}
          </div>
          <ul className="list-disc space-y-1 pl-4">
            {compileResult.details.map((detail, idx) => (
              <li key={idx} className="break-words">
                {Array.isArray(detail.loc) && detail.loc.length > 0 && (
                  <span className="font-mono font-semibold">{detail.loc.join(" → ")}: </span>
                )}
                {detail.msg || detail.type || JSON.stringify(detail)}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function CompileWarningsList({ warnings }) {
  const { t } = useTranslation();
  if (!warnings.length) return null;

  return (
    <div className="space-y-1">
      <CompileOutputSectionTitle>{t("Warnings")}</CompileOutputSectionTitle>
      <ul className="list-disc space-y-1 pl-4">
        {warnings.slice(0, 5).map((warning, idx) => (
          <li key={`${warning.code || "warn"}-${idx}`} className="break-words">
            {warning.message || warning.code || t("Warning")}
          </li>
        ))}
        {warnings.length > 5 ? (
          <li className="opacity-70">{t("Compile More Warnings Count", { count: warnings.length - 5 })}</li>
        ) : null}
      </ul>
    </div>
  );
}

function CompileOutputSuccessState({ preview, warnings, envCount, fileCount, hasStdin }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-3 text-xs">
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge badge-success badge-sm">{t("Ready")}</span>
        <span className="opacity-70">
          {warnings.length > 0
            ? t("Compiled With Warning Count", { count: warnings.length })
            : t("Compiled Successfully")}
        </span>
      </div>

      <div className="space-y-1">
        <CompileOutputSectionTitle>{t("Command")}</CompileOutputSectionTitle>
        <pre className="rounded-box bg-base-100 p-2 whitespace-pre-wrap break-all font-mono text-xs">
          {preview.shell || t("No Shell Preview Available")}
        </pre>
      </div>

      <div className="flex flex-wrap gap-2">
        <CompileSummaryBadge>{t("Compile Summary Env Count", { count: envCount })}</CompileSummaryBadge>
        <CompileSummaryBadge>{t("Compile Summary Files Count", { count: fileCount })}</CompileSummaryBadge>
        <CompileSummaryBadge>
          {t("Compile Summary Stdin", { value: t(hasStdin ? "Yes" : "No") })}
        </CompileSummaryBadge>
      </div>

      <CompileWarningsList warnings={warnings} />
    </div>
  );
}

const CompileOutputPanel = memo(function CompileOutputPanel({ compileResult, lastValues }) {
  const { t } = useTranslation();
  const isOk = Boolean(compileResult?.ok);
  const preview = compileResult?.preview || {};
  const warnings = Array.isArray(compileResult?.warnings) ? compileResult.warnings : [];
  const fileCount = Array.isArray(preview.files) ? preview.files.length : 0;
  const envCount =
    preview.env && typeof preview.env === "object" ? Object.keys(preview.env).length : 0;
  const hasStdin = Boolean(preview.stdin);

  return (
    <div className="card bg-base-200 shadow-md">
      <div className="card-body p-4">
        <h2 className="card-title text-base">{t("Compile Preview Output")}</h2>
        <div className="max-h-[28vh] overflow-auto rounded-box bg-base-300 p-2">
          {!compileResult ? (
            <CompileOutputEmptyState lastValues={lastValues} t={t} />
          ) : !isOk ? (
            <CompileOutputErrorState compileResult={compileResult} />
          ) : (
            <CompileOutputSuccessState
              preview={preview}
              warnings={warnings}
              envCount={envCount}
              fileCount={fileCount}
              hasStdin={hasStdin}
            />
          )}
        </div>
      </div>
    </div>
  );
});

export default CompileOutputPanel;
