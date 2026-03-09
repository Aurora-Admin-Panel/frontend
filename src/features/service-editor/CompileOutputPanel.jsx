import { memo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

function CompileOutputSectionTitle({ children }) {
  return <div className="text-[11px] font-bold uppercase tracking-wider text-base-content/40">{children}</div>;
}

function CompileOutputEmptyState({ lastValues, t }) {
  return (
    <div className="flex h-24 flex-col items-center justify-center gap-1 text-base-content/30">
      <Terminal size={20} />
      <span className="text-xs">
        {lastValues ? t("No compile result yet") : t("Preview Auto Updates While Editing")}
      </span>
    </div>
  );
}

function CompileOutputErrorState({ compileResult }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center gap-2 font-bold text-error">
        <XCircle size={14} />
        {t("Compile Failed")}
      </div>
      <div className="whitespace-pre-wrap break-words text-base-content/70">
        {compileResult?.error || t("Unknown Compile Error")}
      </div>
      {Array.isArray(compileResult?.details) && compileResult.details.length > 0 ? (
        <div className="space-y-1">
          <div className="font-medium text-base-content/50">
            {t("Compile Validation Details Count", { count: compileResult.details.length })}
          </div>
          <ul className="list-disc space-y-1 pl-4 text-base-content/60">
            {compileResult.details.slice(0, 5).map((detail, idx) => (
              <li key={idx} className="break-words">
                {Array.isArray(detail.loc) && detail.loc.length > 0 && (
                  <span className="font-mono font-semibold text-error/80">{detail.loc.join(" > ")}: </span>
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
      <ul className="space-y-1 pl-4 text-warning/80">
        {warnings.slice(0, 5).map((warning, idx) => (
          <li key={`${warning.code || "warn"}-${idx}`} className="flex items-start gap-1.5 break-words">
            <AlertTriangle size={11} className="mt-0.5 shrink-0" />
            <span>{warning.message || warning.code || t("Warning")}</span>
          </li>
        ))}
        {warnings.length > 5 ? (
          <li className="text-base-content/40">{t("Compile More Warnings Count", { count: warnings.length - 5 })}</li>
        ) : null}
      </ul>
    </div>
  );
}

function CompileOutputSuccessState({ preview, warnings, envCount, fileCount, hasStdin }) {
  const { t } = useTranslation();
  return (
    <motion.div
      className="space-y-3 text-xs"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-2">
        <CheckCircle2 size={14} className="text-success" />
        <span className="font-bold text-success">{t("Ready")}</span>
        {warnings.length > 0 && (
          <span className="text-base-content/40">
            {t("Compiled With Warning Count", { count: warnings.length })}
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        <CompileOutputSectionTitle>{t("Command")}</CompileOutputSectionTitle>
        <pre className="overflow-x-auto rounded-lg bg-base-300/70 p-3 font-mono text-[12px] leading-relaxed text-base-content/80 whitespace-pre-wrap break-all">
          {preview.shell || t("No Shell Preview Available")}
        </pre>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {[
          { label: t("Compile Summary Env Count", { count: envCount }), show: true },
          { label: t("Compile Summary Files Count", { count: fileCount }), show: true },
          { label: t("Compile Summary Stdin", { value: t(hasStdin ? "Yes" : "No") }), show: true },
        ].filter(b => b.show).map((b, i) => (
          <span key={i} className="rounded-md bg-base-content/5 px-2 py-0.5 text-[11px] text-base-content/50">
            {b.label}
          </span>
        ))}
      </div>

      <CompileWarningsList warnings={warnings} />
    </motion.div>
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

  const statusColor = !compileResult ? "border-base-300" : isOk ? "border-success/30" : "border-error/30";

  return (
    <div className={`flex flex-col overflow-hidden rounded-xl border bg-base-200 transition-colors duration-300 ${statusColor}`}>
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-base-300 px-4 py-2.5">
        <Terminal size={15} className="text-accent" />
        <h2 className="text-sm font-bold tracking-wide">{t("Compile Preview Output")}</h2>
      </div>

      {/* Output area */}
      <div className="max-h-[28vh] flex-1 overflow-auto p-4">
        <AnimatePresence mode="wait">
          {!compileResult ? (
            <CompileOutputEmptyState key="empty" lastValues={lastValues} t={t} />
          ) : !isOk ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CompileOutputErrorState compileResult={compileResult} />
            </motion.div>
          ) : (
            <CompileOutputSuccessState
              key="success"
              preview={preview}
              warnings={warnings}
              envCount={envCount}
              fileCount={fileCount}
              hasStdin={hasStdin}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

export default CompileOutputPanel;
