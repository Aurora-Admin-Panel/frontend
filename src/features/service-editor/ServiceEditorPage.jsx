import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import useDebouncedCallback from "../../hooks/useDebouncedCallback";
import { serviceDefinitionToDynamicSchema } from "./serviceAdapter";
import ParamEditorPanel from "./ParamEditorPanel";
import AuthoringJsonPanel from "./AuthoringJsonPanel";
import FormPreviewPanel from "./FormPreviewPanel";
import CompileOutputPanel from "./CompileOutputPanel";
import {
  COMPILE_SERVICE_PREVIEW,
  CREATE_SERVICE_DEFINITION,
  DEFAULT_SERVICE_TEMPLATE,
  LIST_SERVICE_DEFINITIONS,
  UPDATE_SERVICE_DEFINITION,
} from "./constants";
import { cloneJson, prettyJson } from "./builderUtils";

const AUTO_COMPILE_DEBOUNCE_MS = 400;

export default function ServiceEditorPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const [selectedId, setSelectedId] = useState(null);
  const [selectedParamIndex, setSelectedParamIndex] = useState(0);
  const [editorText, setEditorText] = useState(prettyJson(DEFAULT_SERVICE_TEMPLATE));
  const [saveMessage, setSaveMessage] = useState("");
  const [lastValues, setLastValues] = useState(null);
  const [compileResult, setCompileResult] = useState(null);
  const compileRequestSeqRef = useRef(0);
  const lastAutoValuesKeyRef = useRef(null);

  const { data, error, refetch } = useQuery(LIST_SERVICE_DEFINITIONS, {
    variables: { limit: 100, offset: 0 },
    fetchPolicy: "network-only",
  });
  const [createService, { loading: createLoading }] = useMutation(CREATE_SERVICE_DEFINITION);
  const [updateService, { loading: updateLoading }] = useMutation(UPDATE_SERVICE_DEFINITION);
  const [compileDraft, { loading: compileDraftLoading }] = useMutation(
    COMPILE_SERVICE_PREVIEW
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
        schema: serviceDefinitionToDynamicSchema(parseState.parsed),
        error: null,
      };
    } catch (e) {
      return {
        schema: null,
        error: String(e),
      };
    }
  }, [parseState]);

  const services = data?.paginatedServiceDefinitions?.items ?? [];
  const routeServiceId = serviceId ? Number(serviceId) : null;
  const previewSchemaKey = editorText;

  useEffect(() => {
    if (!routeServiceId || Number.isNaN(routeServiceId)) {
      return;
    }
    const item = services.find((svc) => Number(svc.id) === routeServiceId);
    if (!item) {
      return;
    }
    setSelectedId(item.id);
    setEditorText(prettyJson(item.configJson));
    setSelectedParamIndex(0);
    setSaveMessage("");
    setCompileResult(null);
  }, [routeServiceId, services]);

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
    navigate("/app/services/editor");
    setSelectedId(null);
    setEditorText(prettyJson(DEFAULT_SERVICE_TEMPLATE));
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
      const res = await createService({
        variables: { configJson: parseState.parsed },
      });
      const created = res?.data?.createServiceDefinition;
      if (created?.id) {
        setSelectedId(created.id);
        setEditorText(prettyJson(created.configJson));
        setSaveMessage(`Created service #${created.id}`);
        await refetch();
        navigate(`/app/services/editor/${created.id}`);
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
      setSaveMessage("Select or create a service first.");
      return;
    }
    if (!parseState.parsed) {
      setSaveMessage("Cannot update invalid JSON.");
      return;
    }
    try {
      const res = await updateService({
        variables: {
          id: Number(selectedId),
          configJson: parseState.parsed,
        },
      });
      if (res?.data?.updateServiceDefinition) {
        setSaveMessage(`Updated service #${selectedId}`);
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
          setCompileResult({ ok: false, error: "Invalid service definition JSON" });
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
        setCompileResult(res?.data?.compileServicePreview ?? null);
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
        <ParamEditorPanel
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
