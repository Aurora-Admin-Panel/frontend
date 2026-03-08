import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import useDebouncedCallback from "../../hooks/useDebouncedCallback";
import { authoringContractToDynamicSchema } from "./authoringAdapter";
import ParamBuilderPanel from "./ParamBuilderPanel";
import AuthoringJsonPanel from "./AuthoringJsonPanel";
import FormPreviewPanel from "./FormPreviewPanel";
import CompileOutputPanel from "./CompileOutputPanel";
import {
  COMPILE_EXECUTABLE_CONTRACT_PREVIEW,
  CREATE_EXECUTABLE_CONTRACT,
  DEFAULT_CONTRACT_TEMPLATE,
  LIST_EXECUTABLE_CONTRACTS,
  UPDATE_EXECUTABLE_CONTRACT,
} from "./constants";
import { cloneJson, prettyJson } from "./builderUtils";

const AUTO_COMPILE_DEBOUNCE_MS = 400;

export default function ContractBuilderPage() {
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
    [compileDraft, parseState]
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

  const compileLoading = compileDraftLoading;
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
