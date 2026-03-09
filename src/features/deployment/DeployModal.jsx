import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@apollo/client";
import classNames from "classnames";
import { Package, Link as LinkIcon } from "lucide-react";
import DataLoading from "../DataLoading";
import useDynamicForm from "../service-editor/useDynamicForm";
import { serviceDefinitionToDynamicSchema } from "../service-editor/serviceAdapter";
import {
  GET_SERVICE_BINDINGS,
  GET_SERVICES_FOR_BINDING,
  GET_AVAILABLE_PORTS,
  DEPLOY_SERVICE,
} from "../../queries/deployment";
import ModalShell from "../ui/ModalShell";

const DeployModal = ({ modalProps, close, resolve }) => {
  const { t } = useTranslation();
  const serverId = modalProps?.serverId;

  const [step, setStep] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedPortId, setSelectedPortId] = useState(null);
  const [formValues, setFormValues] = useState({});

  // Queries
  const { data: bindingsData, loading: bindingsLoading } =
    useQuery(GET_SERVICE_BINDINGS);
  const { data: servicesData, loading: servicesLoading } =
    useQuery(GET_SERVICES_FOR_BINDING);
  const { data: portsData, loading: portsLoading } = useQuery(GET_AVAILABLE_PORTS, {
    variables: { serverId },
    skip: !serverId,
  });

  const [deployService, { loading: deploying }] = useMutation(DEPLOY_SERVICE);

  const bindings = bindingsData?.serviceBindings ?? [];
  const services = servicesData?.serviceDefinitions ?? [];

  const catalogServices = useMemo(
    () => services.filter((s) => s.hasSource),
    [services]
  );

  // Build unified list: built-in services first, then bindings
  const deployableItems = useMemo(() => {
    const items = [];
    for (const s of catalogServices) {
      items.push({
        key: `service-${s.id}`,
        type: "service",
        serviceId: s.id,
        service: s,
        label: s.title,
        sublabel: `${s.serviceKey} v${s.version}`,
        isBuiltin: s.isBuiltin,
      });
    }
    for (const b of bindings) {
      items.push({
        key: `binding-${b.id}`,
        type: "binding",
        bindingId: b.id,
        service: b.service,
        label: `${b.file?.name || `File #${b.fileId}`}`,
        sublabel: b.service?.title || b.service?.serviceKey || `Service #${b.serviceId}`,
        fileVersion: b.file?.version,
      });
    }
    return items;
  }, [catalogServices, bindings]);

  const selectedService = selectedItem?.service ?? null;

  const formSchema = useMemo(() => {
    if (!selectedService?.configJson) return null;
    try {
      return serviceDefinitionToDynamicSchema(selectedService.configJson);
    } catch {
      return null;
    }
  }, [selectedService]);

  const requiresPort = selectedService?.configJson?.requiresPort !== false;

  const handleValuesChange = useCallback((values) => {
    setFormValues(values);
  }, []);

  const handleFormSubmit = useCallback((values) => {
    setFormValues(values);
  }, []);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setSelectedPortId(null);
    setStep(2);
  };

  const handleDeploy = async () => {
    if (!serverId || !selectedItem) return;

    const variables = {
      serverIds: [serverId],
      values: formValues,
      portId: selectedPortId,
    };

    if (selectedItem.type === "service") {
      variables.serviceId = selectedItem.serviceId;
    } else {
      variables.serviceBindingId = selectedItem.bindingId;
    }

    await deployService({ variables });
    if (resolve) resolve(true);
    close();
  };

  const handleCancel = () => {
    if (resolve) resolve(false);
    close();
  };

  const handleBack = () => {
    setSelectedItem(null);
    setSelectedPortId(null);
    setFormValues({});
    setStep(1);
  };

  const isAnyLoading = bindingsLoading || servicesLoading;

  return (
    <ModalShell
      title={t("Deploy Service")}
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
          {/* Step 1: Pick a deployable item */}
          {step === 1 && (
            <div className="mt-4 space-y-4">
              {deployableItems.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm opacity-60">{t("No services available")}</p>
                  <div className="mt-3 flex justify-center gap-2">
                    <a href="/app/services" className="btn btn-outline btn-sm">
                      {t("Browse Service Definitions")}
                    </a>
                    <a href="/app/files" className="btn btn-outline btn-sm">
                      {t("Upload a File")}
                    </a>
                  </div>
                </div>
              ) : (
                <div className="max-h-72 space-y-1 overflow-auto">
                  {deployableItems.map((item) => (
                    <div
                      key={item.key}
                      className="flex cursor-pointer items-center justify-between rounded-lg bg-base-300 px-3 py-2 hover:bg-primary/10"
                      onClick={() => handleSelectItem(item)}
                    >
                      <div className="flex items-center gap-2">
                        {item.type === "service" ? (
                          <Package size={14} className="opacity-40" />
                        ) : (
                          <LinkIcon size={14} className="opacity-40" />
                        )}
                        <span className="font-medium">{item.label}</span>
                        {item.type === "binding" && (
                          <>
                            <span className="opacity-40">&rarr;</span>
                            <span className="text-sm opacity-70">{item.sublabel}</span>
                          </>
                        )}
                        {item.type === "service" && (
                          <span className="badge badge-ghost badge-xs font-mono">
                            {item.sublabel}
                          </span>
                        )}
                        {item.isBuiltin && (
                          <span className="badge badge-info badge-xs">
                            {t("Built-in")}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {item.fileVersion && (
                          <span className="text-xs opacity-50">v{item.fileVersion}</span>
                        )}
                        {item.type === "service" && (
                          <span className="text-xs opacity-50">v{item.service?.version}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end">
                <button className="btn btn-outline" onClick={handleCancel}>
                  {t("Cancel")}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Configure & deploy */}
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
                    onChange={(e) =>
                      setSelectedPortId(e.target.value ? Number(e.target.value) : null)
                    }
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
                  {!portsLoading &&
                    portsData?.availablePortsForDeployment?.length === 0 && (
                      <p className="text-sm text-error mt-1">
                        {t("No available ports on this server")}
                      </p>
                    )}
                </div>
              )}

              {/* Service form */}
              {formSchema && (
                <div>
                  <h4 className="mb-2 font-semibold text-sm">{t("Parameters")}</h4>
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
                  <div>
                    <span className="opacity-60">{t("Service")}:</span>{" "}
                    <span>
                      {selectedService?.title || selectedService?.serviceKey}
                    </span>
                  </div>
                  {selectedItem?.type === "binding" && (
                    <div>
                      <span className="opacity-60">{t("File")}:</span>{" "}
                      <span>{selectedItem.label}</span>
                    </div>
                  )}
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
                  className={classNames("btn btn-primary", { loading: deploying })}
                  onClick={handleDeploy}
                  disabled={deploying || (requiresPort && !selectedPortId)}
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
