import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import DataLoading from "../../DataLoading";
import useDynamicForm from "../useDynamicForm";
import useDebouncedCallback from "../useDebouncedCallback";
import { authoringContractToDynamicSchema } from "../authoringAdapter";
import ParamBuilderPanel from "./ParamBuilderPanel";
import {
  COMPILE_EXECUTABLE_CONTRACT_PREVIEW,
  COMPILE_EXECUTABLE_CONTRACT_PREVIEW_BY_ID,
  CREATE_EXECUTABLE_CONTRACT,
  DEFAULT_CONTRACT_TEMPLATE,
  LIST_EXECUTABLE_CONTRACTS,
  UPDATE_EXECUTABLE_CONTRACT,
} from "./constants";
import { cloneJson, prettyJson } from "./utils";

const AUTO_COMPILE_DEBOUNCE_MS = 400;

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
        <div className="opacity-70">
          {t("Compile Validation Details Count", { count: compileResult.details.length })}
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

export default function ExecutableContractWorkbench() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { contractId } = useParams();
  const [selectedId, setSelectedId] = useState(null);
  const [selectedParamIndex, setSelectedParamIndex] = useState(0);
  const [editorText, setEditorText] = useState(prettyJson(DEFAULT_CONTRACT_TEMPLATE));
  const [saveMessage, setSaveMessage] = useState("");
  const [lastValues, setLastValues] = useState(null);
  const [compileResult, setCompileResult] = useState(null);
  const compileRequestSeqRef = useRef(0);
  const lastAutoValuesKeyRef = useRef(null);

  const { data, error, refetch } = useQuery(LIST_EXECUTABLE_CONTRACTS, {
    variables: { limit: 100, offset: 0 },
    fetchPolicy: "network-only",
  });
  const [createContract, { loading: createLoading }] = useMutation(CREATE_EXECUTABLE_CONTRACT);
  const [updateContract, { loading: updateLoading }] = useMutation(UPDATE_EXECUTABLE_CONTRACT);
  const [compileDraft, { loading: compileDraftLoading }] = useMutation(
    COMPILE_EXECUTABLE_CONTRACT_PREVIEW
  );
  const [compileById, { loading: compileByIdLoading }] = useMutation(
    COMPILE_EXECUTABLE_CONTRACT_PREVIEW_BY_ID
  );

  const parseState = useMemo(() => {
    try {
      const parsed = JSON.parse(editorText);
      return { parsed, parseError: null };
    } catch (e) {
      return { parsed: null, parseError: String(e) };
    }
  }, [editorText]);

  const adaptedFormState = useMemo(() => {
    if (!parseState.parsed) return { schema: null, error: null };
    try {
      return {
        schema: authoringContractToDynamicSchema(parseState.parsed),
        error: null,
      };
    } catch (e) {
      return {
        schema: null,
        error: String(e),
      };
    }
  }, [parseState]);

  const contracts = data?.paginatedExecutableContracts?.items ?? [];
  const routeContractId = contractId ? Number(contractId) : null;
  const previewSchemaKey = editorText;

  useEffect(() => {
    if (!routeContractId || Number.isNaN(routeContractId)) {
      return;
    }
    const item = contracts.find((contract) => Number(contract.id) === routeContractId);
    if (!item) {
      return;
    }
    setSelectedId(item.id);
    setEditorText(prettyJson(item.schemaJson));
    setSelectedParamIndex(0);
    setSaveMessage("");
    setCompileResult(null);
  }, [routeContractId, contracts]);

  const applyDraftMutation = useCallback(
    (mutator) => {
      if (!parseState.parsed) return;
      const next = cloneJson(parseState.parsed);
      if (!Array.isArray(next.params)) next.params = [];
      mutator(next);
      setEditorText(prettyJson(next));
      setCompileResult(null);
    },
    [parseState]
  );

  const handleNew = () => {
    navigate("/app/contracts/builder");
    setSelectedId(null);
    setEditorText(prettyJson(DEFAULT_CONTRACT_TEMPLATE));
    setSelectedParamIndex(0);
    setSaveMessage("");
    setCompileResult(null);
  };

  const handleSaveNew = async () => {
    setSaveMessage("");
    if (!parseState.parsed) {
      setSaveMessage("Cannot save invalid JSON.");
      return;
    }
    try {
      const res = await createContract({
        variables: { schemaJson: parseState.parsed },
      });
      const created = res?.data?.createExecutableContract;
      if (created?.id) {
        setSelectedId(created.id);
        setEditorText(prettyJson(created.schemaJson));
        setSaveMessage(`Created contract #${created.id}`);
        await refetch();
        navigate(`/app/contracts/builder/${created.id}`);
      } else {
        setSaveMessage("Create failed.");
      }
    } catch (e) {
      setSaveMessage(String(e?.message || e));
    }
  };

  const handleUpdate = async () => {
    setSaveMessage("");
    if (!selectedId) {
      setSaveMessage("Select or create a contract first.");
      return;
    }
    if (!parseState.parsed) {
      setSaveMessage("Cannot update invalid JSON.");
      return;
    }
    try {
      const res = await updateContract({
        variables: {
          id: Number(selectedId),
          schemaJson: parseState.parsed,
        },
      });
      if (res?.data?.updateExecutableContract) {
        setSaveMessage(`Updated contract #${selectedId}`);
        await refetch();
      } else {
        setSaveMessage(`Update failed for #${selectedId}`);
      }
    } catch (e) {
      setSaveMessage(String(e?.message || e));
    }
  };

  const compilePreview = useCallback(
    async (values) => {
      const requestSeq = ++compileRequestSeqRef.current;
      setLastValues(values);
      try {
        if (selectedId) {
          const res = await compileById({
            variables: {
              id: Number(selectedId),
              values,
              context: { jobId: "preview-ui" },
            },
          });
          if (requestSeq !== compileRequestSeqRef.current) return;
          setCompileResult(res?.data?.compileExecutableContractPreviewById ?? null);
          return;
        }
        if (!parseState.parsed) {
          if (requestSeq !== compileRequestSeqRef.current) return;
          setCompileResult({ ok: false, error: "Invalid contract JSON" });
          return;
        }
        const res = await compileDraft({
          variables: {
            contract: parseState.parsed,
            values,
            context: { jobId: "preview-ui" },
          },
        });
        if (requestSeq !== compileRequestSeqRef.current) return;
        setCompileResult(res?.data?.compileExecutableContractPreview ?? null);
      } catch (e) {
        if (requestSeq !== compileRequestSeqRef.current) return;
        setCompileResult({ ok: false, error: String(e?.message || e) });
      }
    },
    [compileById, compileDraft, parseState, selectedId]
  );

  const { debouncedCallback: scheduleAutoCompile, cancel: cancelAutoCompile } = useDebouncedCallback(
    (values) => {
      compilePreview(values);
    },
    AUTO_COMPILE_DEBOUNCE_MS
  );

  const handlePreviewValuesChange = useCallback(
    (values) => {
      const valuesKey = JSON.stringify(values ?? {});
      if (valuesKey === lastAutoValuesKeyRef.current) return;
      lastAutoValuesKeyRef.current = valuesKey;
      scheduleAutoCompile(values);
    },
    [scheduleAutoCompile]
  );

  const handleCompileFromForm = useCallback(
    (values) => {
      cancelAutoCompile();
      const valuesKey = JSON.stringify(values ?? {});
      lastAutoValuesKeyRef.current = valuesKey;
      return compilePreview(values);
    },
    [cancelAutoCompile, compilePreview]
  );

  useEffect(() => {
    cancelAutoCompile();
    lastAutoValuesKeyRef.current = null;
    // Invalidate any in-flight compile response from the previous preview form instance.
    compileRequestSeqRef.current += 1;
  }, [previewSchemaKey, cancelAutoCompile]);

  const compileLoading = compileDraftLoading || compileByIdLoading;
  const saveLoading = createLoading || updateLoading;

  if (error) {
    return (
      <div className="px-6 py-4">
        <div className="alert alert-error">
          <span>{String(error.message || error)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-4 px-4 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("Schema Builder")}</h1>
          <p className="text-sm opacity-70">
            Build authoring schema JSON, render a parameter form, and compile a preview.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm" onClick={handleNew} type="button">
            {t("New")}
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleSaveNew}
            type="button"
            disabled={saveLoading}
          >
            {createLoading ? t("Saving") : t("Save New")}
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleUpdate}
            type="button"
            disabled={saveLoading || !selectedId}
          >
            {updateLoading ? t("Updating") : t("Update")}
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="alert alert-info py-2">
          <span>{saveMessage}</span>
        </div>
      )}

      {!parseState.parseError && parseState.parsed && (
        <ParamBuilderPanel
          contract={parseState.parsed}
          selectedParamIndex={selectedParamIndex}
          setSelectedParamIndex={setSelectedParamIndex}
          applyDraftMutation={applyDraftMutation}
        />
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <AuthoringJsonPanel
          selectedId={selectedId}
          editorText={editorText}
          setEditorText={setEditorText}
          parseError={parseState.parseError}
          adapterError={adaptedFormState.error}
          setCompileResult={setCompileResult}
        />

        <div className="xl:col-span-6 flex flex-col gap-4">
          <FormPreviewPanel
            formSchema={adaptedFormState.schema}
            previewSchemaKey={previewSchemaKey}
            selectedId={selectedId}
            compileLoading={compileLoading}
            onSubmit={handleCompileFromForm}
            onValuesChange={handlePreviewValuesChange}
          />

          <CompileOutputPanel compileResult={compileResult} lastValues={lastValues} />
        </div>
      </div>
    </div>
  );
}
