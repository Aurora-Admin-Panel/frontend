import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@apollo/client";
import classNames from "classnames";
import DataLoading from "../DataLoading";
import useDynamicForm from "../service-editor/useDynamicForm";
import { serviceDefinitionToDynamicSchema } from "../service-editor/serviceAdapter";
import {
  GET_SERVICE_BINDINGS,
  GET_EXECUTABLE_FILES,
  GET_SERVICES_FOR_BINDING,
  GET_AVAILABLE_PORTS,
  CREATE_SERVICE_BINDING,
  DEPLOY_EXECUTABLE,
  DEPLOY_SERVICE,
} from "../../queries/deployment";
import ModalShell from "../ui/ModalShell";

const DeployModal = ({ modalProps, close, resolve }) => {
  const { t } = useTranslation();
  const serverId = modalProps?.serverId;

  // Step: 1 = select source, 2 = fill form + confirm & deploy
  const [step, setStep] = useState(1);
  // Tab within step 1: "catalog" or "binding"
  const [tab, setTab] = useState("catalog");

  // Binding selection (for binding tab)
  const [selectedServiceBindingId, setSelectedServiceBindingId] = useState(null);
  const [selectedFileId, setSelectedFileId] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");

  // Catalog selection (for catalog tab)
  const [selectedCatalogServiceId, setSelectedCatalogServiceId] = useState(null);

  // Port selection
  const [selectedPortId, setSelectedPortId] = useState(null);

  // Form values
  const [formValues, setFormValues] = useState({});

  // Queries
  const { data: bindingsData, loading: bindingsLoading, refetch: refetchBindings } =
    useQuery(GET_SERVICE_BINDINGS);
  const { data: filesData, loading: filesLoading } = useQuery(GET_EXECUTABLE_FILES);
  const { data: servicesData, loading: servicesLoading } =
    useQuery(GET_SERVICES_FOR_BINDING);
  const { data: portsData, loading: portsLoading } = useQuery(GET_AVAILABLE_PORTS, {
    variables: { serverId },
    skip: !serverId,
  });

  // Mutations
  const [createBinding, { loading: creatingBinding }] = useMutation(
    CREATE_SERVICE_BINDING
  );
  const [deployExecutable, { loading: deploying }] = useMutation(DEPLOY_EXECUTABLE);
  const [deployService, { loading: deployingService }] = useMutation(DEPLOY_SERVICE);

  const bindings = bindingsData?.serviceBindings ?? [];
  const files = filesData?.files ?? [];
  const services = servicesData?.serviceDefinitions ?? [];

  // Services with a source (for catalog tab)
  const catalogServices = useMemo(
    () => services.filter((c) => c.hasSource),
    [services]
  );

  // Determine which mode we're in
  const isCatalogMode = tab === "catalog" && selectedCatalogServiceId;

  // Find selected service for form rendering
  const selectedService = useMemo(() => {
    if (isCatalogMode) {
      return services.find((c) => c.id === selectedCatalogServiceId);
    }
    if (selectedServiceBindingId) {
      const binding = bindings.find((b) => b.id === selectedServiceBindingId);
      if (binding?.service) {
        return binding.service;
      }
    }
    if (selectedServiceId) {
      return services.find((c) => c.id === Number(selectedServiceId));
    }
    return null;
  }, [isCatalogMode, selectedCatalogServiceId, selectedServiceBindingId, selectedServiceId, bindings, services]);

  // Build form schema from service definition
  const formSchema = useMemo(() => {
    if (!selectedService?.configJson) return null;
    try {
      return serviceDefinitionToDynamicSchema(selectedService.configJson);
    } catch {
      return null;
    }
  }, [selectedService]);

  // Check if the selected service requires a port (default true)
  const requiresPort = selectedService?.configJson?.requiresPort !== false;

  const handleValuesChange = useCallback((values) => {
    setFormValues(values);
  }, []);

  const handleFormSubmit = useCallback((values) => {
    setFormValues(values);
  }, []);

  const handleCreateBindingAndContinue = async () => {
    if (!selectedFileId || !selectedServiceId) return;
    const { data } = await createBinding({
      variables: {
        fileId: Number(selectedFileId),
        serviceId: Number(selectedServiceId),
      },
    });
    if (data?.createServiceBinding) {
      setSelectedServiceBindingId(data.createServiceBinding.id);
      await refetchBindings();
      setStep(2);
    }
  };

  const handleSelectExistingBinding = (bindingId) => {
    setSelectedServiceBindingId(bindingId);
    setSelectedPortId(null);
    setStep(2);
  };

  const handleSelectCatalogService = (serviceId) => {
    setSelectedCatalogServiceId(serviceId);
    setSelectedPortId(null);
    setStep(2);
  };

  const handleDeploy = async () => {
    if (!serverId) return;

    if (isCatalogMode) {
      // Deploy via service directly
      await deployService({
        variables: {
          serviceId: selectedCatalogServiceId,
          serverIds: [serverId],
          values: formValues,
          portId: selectedPortId,
        },
      });
    } else if (selectedServiceBindingId) {
      // Deploy via binding
      await deployExecutable({
        variables: {
          serviceBindingId: selectedServiceBindingId,
          serverIds: [serverId],
          values: formValues,
          portId: selectedPortId,
        },
      });
    }
    if (resolve) resolve(true);
    close();
  };

  const handleCancel = () => {
    if (resolve) resolve(false);
    close();
  };

  const handleBack = () => {
    setSelectedCatalogServiceId(null);
    setSelectedServiceBindingId(null);
    setSelectedPortId(null);
    setFormValues({});
    setStep(1);
  };

  const isAnyLoading = bindingsLoading || filesLoading || servicesLoading;
  const isDeploying = deploying || deployingService;

  return (
    <ModalShell
      title={t("Deploy Executable")}
      onClose={handleCancel}
      maxWidth="max-w-3xl"
    >
      {/* Steps indicator */}
      <ul className="steps steps-horizontal w-full">
        <li className={classNames("step", step >= 1 && "step-primary")}>
          {t("Select")}
        </li>
        <li className={classNames("step", step >= 2 && "step-primary")}>
          {t("Configure")}
        </li>
      </ul>

      {isAnyLoading ? (
        <div className="py-8">
          <DataLoading />
        </div>
      ) : (
        <>
          {/* Step 1: Select source */}
          {step === 1 && (
            <div className="mt-4 space-y-4">
              {/* Tabs */}
              <div role="tablist" className="tabs tabs-bordered">
                <button
                  role="tab"
                  className={classNames("tab", tab === "catalog" && "tab-active")}
                  onClick={() => setTab("catalog")}
                  type="button"
                >
                  {t("Service Catalog")}
                </button>
                <button
                  role="tab"
                  className={classNames("tab", tab === "binding" && "tab-active")}
                  onClick={() => setTab("binding")}
                  type="button"
                >
                  {t("From Binding")}
                </button>
              </div>

              {/* Catalog tab */}
              {tab === "catalog" && (
                <div>
                  {catalogServices.length === 0 ? (
                    <div className="py-6 text-center text-sm opacity-60">
                      {t("No catalog services available")}
                    </div>
                  ) : (
                    <div className="max-h-64 space-y-1 overflow-auto">
                      {catalogServices.map((c) => (
                        <div
                          key={c.id}
                          className="flex cursor-pointer items-center justify-between rounded-lg bg-base-300 px-3 py-2 hover:bg-primary/10"
                          onClick={() => handleSelectCatalogService(c.id)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{c.title}</span>
                            <span className="badge badge-ghost badge-xs font-mono">
                              {c.serviceKey}
                            </span>
                            {c.isBuiltin && (
                              <span className="badge badge-info badge-xs">
                                {t("Built-in")}
                              </span>
                            )}
                          </div>
                          <span className="text-xs opacity-50">v{c.version}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Binding tab */}
              {tab === "binding" && (
                <div className="space-y-4">
                  {/* Existing bindings */}
                  {bindings.length > 0 && (
                    <div>
                      <h4 className="mb-2 font-semibold text-sm">
                        {t("Existing Bindings")}
                      </h4>
                      <div className="max-h-48 overflow-auto space-y-1">
                        {bindings.map((b) => (
                            <div
                              key={b.id}
                              className="flex cursor-pointer items-center justify-between rounded-lg bg-base-300 px-3 py-2 hover:bg-primary/10"
                              onClick={() => handleSelectExistingBinding(b.id)}
                            >
                              <div className="text-sm">
                                <span className="font-medium">
                                  {b.file?.name || `File #${b.fileId}`}
                                </span>
                                <span className="mx-2 opacity-50">&rarr;</span>
                                <span className="font-mono text-xs">
                                  {b.service?.title || b.service?.serviceKey || `Service #${b.serviceId}`}
                                </span>
                              </div>
                              <span className="badge badge-ghost badge-sm">#{b.id}</span>
                            </div>
                          ))}
                      </div>
                      <div className="divider text-xs opacity-50">{t("or create new")}</div>
                    </div>
                  )}

                  {/* Create new binding */}
                  <div className="flex flex-col gap-3">
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend">{t("Executable File")}</legend>
                      <select
                        className="select select-bordered w-full"
                        value={selectedFileId}
                        onChange={(e) => setSelectedFileId(e.target.value)}
                      >
                        <option value="">{t("Please select")}</option>
                        {files.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name} {f.version ? `(${f.version})` : ""}
                          </option>
                        ))}
                      </select>
                    </fieldset>
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend">{t("Service")}</legend>
                      <select
                        className="select select-bordered w-full"
                        value={selectedServiceId}
                        onChange={(e) => setSelectedServiceId(e.target.value)}
                      >
                        <option value="">{t("Please select")}</option>
                        {services.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title} ({c.serviceKey} v{c.version})
                          </option>
                        ))}
                      </select>
                    </fieldset>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button className="btn btn-outline" onClick={handleCancel}>
                      {t("Cancel")}
                    </button>
                    <button
                      className={classNames("btn btn-primary", {
                        loading: creatingBinding,
                      })}
                      disabled={!selectedFileId || !selectedServiceId}
                      onClick={handleCreateBindingAndContinue}
                    >
                      {t("Continue")}
                    </button>
                  </div>
                </div>
              )}

              {tab === "catalog" && (
                <div className="flex justify-end">
                  <button className="btn btn-outline" onClick={handleCancel}>
                    {t("Cancel")}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Fill form + deploy */}
          {step === 2 && (
            <div className="mt-4 space-y-4">
              {/* Port selector */}
              {requiresPort && (
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">{t("Port")}</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={selectedPortId || ""}
                    onChange={(e) => setSelectedPortId(e.target.value ? Number(e.target.value) : null)}
                  >
                    <option value="">{t("Select a port...")}</option>
                    {portsData?.availablePortsForDeployment?.map((port) => (
                      <option key={port.id} value={port.id}>
                        {t("Port")} {port.num}
                        {port.externalNum && port.externalNum !== port.num
                          ? ` → ${port.externalNum}`
                          : ""}
                      </option>
                    ))}
                  </select>
                  {!portsLoading && portsData?.availablePortsForDeployment?.length === 0 && (
                    <p className="text-sm text-error mt-1">{t("No available ports on this server")}</p>
                  )}
                </div>
              )}

              {/* Service form */}
              {formSchema && (
                <div>
                  <h4 className="mb-2 font-semibold text-sm">
                    {t("Parameters")}
                  </h4>
                  <div className="max-h-64 overflow-auto rounded-lg bg-base-300 p-3">
                    <ServiceValuesForm
                      formSchema={formSchema}
                      onSubmit={handleFormSubmit}
                      onValuesChange={handleValuesChange}
                    />
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="rounded-lg bg-base-300 p-4">
                <h4 className="mb-2 font-semibold text-sm">{t("Summary")}</h4>
                <div className="space-y-1 text-sm">
                  {isCatalogMode ? (
                    <div>
                      <span className="opacity-60">{t("Service")}:</span>{" "}
                      <span>{selectedService?.title}</span>
                    </div>
                  ) : (
                    <div>
                      <span className="opacity-60">{t("Binding")}:</span>{" "}
                      <span className="font-mono">#{selectedServiceBindingId}</span>
                    </div>
                  )}
                  <div>
                    <span className="opacity-60">{t("Service")}:</span>{" "}
                    <span>
                      {selectedService?.title || selectedService?.serviceKey}
                    </span>
                  </div>
                  {Object.keys(formValues).length > 0 && (
                    <div>
                      <span className="opacity-60">{t("Parameters")}:</span>
                      <pre className="mt-1 max-h-32 overflow-auto rounded bg-base-100 p-2 text-xs">
                        {JSON.stringify(formValues, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <button className="btn btn-outline btn-sm" onClick={handleBack}>
                  {t("Back")}
                </button>
                <button
                  className={classNames("btn btn-primary", { loading: isDeploying })}
                  onClick={handleDeploy}
                  disabled={isDeploying || (requiresPort && !selectedPortId)}
                >
                  {t("Deploy")}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </ModalShell>
  );
};

function ServiceValuesForm({ formSchema, onSubmit, onValuesChange }) {
  const { form } = useDynamicForm({
    schema: formSchema,
    onSubmit,
    onValuesChange,
  });
  return form;
}

export default DeployModal;
