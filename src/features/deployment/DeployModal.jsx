import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@apollo/client";
import classNames from "classnames";
import DataLoading from "../DataLoading";
import useDynamicForm from "../contract-builder/useDynamicForm";
import { authoringContractToDynamicSchema } from "../contract-builder/authoringAdapter";
import {
  GET_FILE_CONTRACT_BINDINGS,
  GET_EXECUTABLE_FILES,
  GET_CONTRACTS_FOR_BINDING,
  CREATE_FILE_CONTRACT_BINDING,
  DEPLOY_EXECUTABLE,
  DEPLOY_CONTRACT,
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
  const [selectedBindingId, setSelectedBindingId] = useState(null);
  const [selectedFileId, setSelectedFileId] = useState("");
  const [selectedContractId, setSelectedContractId] = useState("");

  // Catalog selection (for catalog tab)
  const [selectedCatalogContractId, setSelectedCatalogContractId] = useState(null);

  // Form values
  const [formValues, setFormValues] = useState({});

  // Queries
  const { data: bindingsData, loading: bindingsLoading, refetch: refetchBindings } =
    useQuery(GET_FILE_CONTRACT_BINDINGS);
  const { data: filesData, loading: filesLoading } = useQuery(GET_EXECUTABLE_FILES);
  const { data: contractsData, loading: contractsLoading } =
    useQuery(GET_CONTRACTS_FOR_BINDING);

  // Mutations
  const [createBinding, { loading: creatingBinding }] = useMutation(
    CREATE_FILE_CONTRACT_BINDING
  );
  const [deployExecutable, { loading: deploying }] = useMutation(DEPLOY_EXECUTABLE);
  const [deployContract, { loading: deployingContract }] = useMutation(DEPLOY_CONTRACT);

  const bindings = bindingsData?.fileContractBindings ?? [];
  const files = filesData?.files ?? [];
  const contracts = contractsData?.executableContracts ?? [];

  // Contracts with a source (for catalog tab)
  const catalogContracts = useMemo(
    () => contracts.filter((c) => c.hasSource),
    [contracts]
  );

  // Determine which mode we're in
  const isCatalogMode = tab === "catalog" && selectedCatalogContractId;

  // Find selected contract for form rendering
  const selectedContract = useMemo(() => {
    if (isCatalogMode) {
      return contracts.find((c) => c.id === selectedCatalogContractId);
    }
    if (selectedBindingId) {
      const binding = bindings.find((b) => b.id === selectedBindingId);
      if (binding) {
        return contracts.find((c) => c.id === binding.contractId);
      }
    }
    if (selectedContractId) {
      return contracts.find((c) => c.id === Number(selectedContractId));
    }
    return null;
  }, [isCatalogMode, selectedCatalogContractId, selectedBindingId, selectedContractId, bindings, contracts]);

  // Build form schema from contract
  const formSchema = useMemo(() => {
    if (!selectedContract?.schemaJson) return null;
    try {
      return authoringContractToDynamicSchema(selectedContract.schemaJson);
    } catch {
      return null;
    }
  }, [selectedContract]);

  const handleValuesChange = useCallback((values) => {
    setFormValues(values);
  }, []);

  const handleFormSubmit = useCallback((values) => {
    setFormValues(values);
  }, []);

  const handleCreateBindingAndContinue = async () => {
    if (!selectedFileId || !selectedContractId) return;
    const { data } = await createBinding({
      variables: {
        fileId: Number(selectedFileId),
        contractId: Number(selectedContractId),
      },
    });
    if (data?.createFileContractBinding) {
      setSelectedBindingId(data.createFileContractBinding.id);
      await refetchBindings();
      setStep(2);
    }
  };

  const handleSelectExistingBinding = (bindingId) => {
    setSelectedBindingId(bindingId);
    setStep(2);
  };

  const handleSelectCatalogContract = (contractId) => {
    setSelectedCatalogContractId(contractId);
    setStep(2);
  };

  const handleDeploy = async () => {
    if (!serverId) return;

    if (isCatalogMode) {
      // Deploy via contract directly
      await deployContract({
        variables: {
          contractId: selectedCatalogContractId,
          serverIds: [serverId],
          values: formValues,
        },
      });
    } else if (selectedBindingId) {
      // Deploy via binding
      await deployExecutable({
        variables: {
          bindingId: selectedBindingId,
          serverIds: [serverId],
          values: formValues,
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
    setSelectedCatalogContractId(null);
    setSelectedBindingId(null);
    setFormValues({});
    setStep(1);
  };

  const isAnyLoading = bindingsLoading || filesLoading || contractsLoading;
  const isDeploying = deploying || deployingContract;

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
                  {t("App Catalog")}
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
                  {catalogContracts.length === 0 ? (
                    <div className="py-6 text-center text-sm opacity-60">
                      {t("No catalog apps available")}
                    </div>
                  ) : (
                    <div className="max-h-64 space-y-1 overflow-auto">
                      {catalogContracts.map((c) => (
                        <div
                          key={c.id}
                          className="flex cursor-pointer items-center justify-between rounded-lg bg-base-300 px-3 py-2 hover:bg-primary/10"
                          onClick={() => handleSelectCatalogContract(c.id)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{c.title}</span>
                            <span className="badge badge-ghost badge-xs font-mono">
                              {c.contractKey}
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
                        {bindings.map((b) => {
                          const file = files.find((f) => f.id === b.fileId);
                          const contract = contracts.find((c) => c.id === b.contractId);
                          return (
                            <div
                              key={b.id}
                              className="flex cursor-pointer items-center justify-between rounded-lg bg-base-300 px-3 py-2 hover:bg-primary/10"
                              onClick={() => handleSelectExistingBinding(b.id)}
                            >
                              <div className="text-sm">
                                <span className="font-medium">
                                  {file?.name || `File #${b.fileId}`}
                                </span>
                                <span className="mx-2 opacity-50">&rarr;</span>
                                <span className="font-mono text-xs">
                                  {contract?.title || contract?.contractKey || `Contract #${b.contractId}`}
                                </span>
                              </div>
                              <span className="badge badge-ghost badge-sm">#{b.id}</span>
                            </div>
                          );
                        })}
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
                      <legend className="fieldset-legend">{t("Contract")}</legend>
                      <select
                        className="select select-bordered w-full"
                        value={selectedContractId}
                        onChange={(e) => setSelectedContractId(e.target.value)}
                      >
                        <option value="">{t("Please select")}</option>
                        {contracts.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title} ({c.contractKey} v{c.version})
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
                      disabled={!selectedFileId || !selectedContractId}
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
              {/* Contract form */}
              {formSchema && (
                <div>
                  <h4 className="mb-2 font-semibold text-sm">
                    {t("Parameters")}
                  </h4>
                  <div className="max-h-64 overflow-auto rounded-lg bg-base-300 p-3">
                    <ContractValuesForm
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
                      <span className="opacity-60">{t("App")}:</span>{" "}
                      <span>{selectedContract?.title}</span>
                    </div>
                  ) : (
                    <div>
                      <span className="opacity-60">{t("Binding")}:</span>{" "}
                      <span className="font-mono">#{selectedBindingId}</span>
                    </div>
                  )}
                  <div>
                    <span className="opacity-60">{t("Contract")}:</span>{" "}
                    <span>
                      {selectedContract?.title || selectedContract?.contractKey}
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
                  disabled={isDeploying}
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

function ContractValuesForm({ formSchema, onSubmit, onValuesChange }) {
  const { form } = useDynamicForm({
    schema: formSchema,
    onSubmit,
    onValuesChange,
  });
  return form;
}

export default DeployModal;
