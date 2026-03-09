import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@apollo/client";
import classNames from "classnames";
import DataLoading from "../DataLoading";
import { useModal } from "../../atoms/modal";
import {
  GET_SERVICE_BINDINGS,
  GET_EXECUTABLE_FILES,
  GET_SERVICES_FOR_BINDING,
  CREATE_SERVICE_BINDING,
  DELETE_SERVICE_BINDING,
} from "../../queries/deployment";
import ModalShell from "../ui/ModalShell";

const BindingModal = ({ close, resolve }) => {
  const { t } = useTranslation();
  const { confirm } = useModal();

  const [selectedFileId, setSelectedFileId] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const {
    data: bindingsData,
    loading: bindingsLoading,
    refetch,
  } = useQuery(GET_SERVICE_BINDINGS);
  const { data: filesData, loading: filesLoading } = useQuery(GET_EXECUTABLE_FILES);
  const { data: servicesData, loading: servicesLoading } =
    useQuery(GET_SERVICES_FOR_BINDING);

  const [createBinding, { loading: creating }] = useMutation(
    CREATE_SERVICE_BINDING
  );
  const [deleteBinding] = useMutation(DELETE_SERVICE_BINDING);

  const bindings = bindingsData?.serviceBindings ?? [];
  const files = filesData?.files ?? [];
  const services = servicesData?.serviceDefinitions ?? [];

  const handleCreate = async () => {
    if (!selectedFileId || !selectedServiceId) return;
    await createBinding({
      variables: {
        fileId: Number(selectedFileId),
        serviceId: Number(selectedServiceId),
        isDefault,
      },
    });
    setSelectedFileId("");
    setSelectedServiceId("");
    setIsDefault(false);
    refetch();
  };

  const handleDelete = async (id) => {
    const confirmed = await confirm({
      title: t("Delete Binding"),
      message: t("Are you sure you want to delete this binding?"),
    });
    if (!confirmed) return;
    await deleteBinding({ variables: { id } });
    refetch();
  };

  const handleClose = () => {
    if (resolve) resolve(true);
    close();
  };

  const isLoading = bindingsLoading || filesLoading || servicesLoading;

  return (
    <ModalShell
      title={t("Service Bindings")}
      onClose={handleClose}
      maxWidth="max-w-2xl"
      footer={
        <button className="btn btn-outline" onClick={handleClose}>
          {t("Close")}
        </button>
      }
    >
      {isLoading ? (
        <div className="py-8">
          <DataLoading />
        </div>
      ) : (
        <>
          {/* Create new binding */}
          <div className="rounded-lg bg-base-300 p-4">
            <h4 className="mb-2 text-sm font-semibold">{t("Create Binding")}</h4>
            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                className="select select-bordered select-sm flex-1"
                value={selectedFileId}
                onChange={(e) => setSelectedFileId(e.target.value)}
              >
                <option value="">{t("Executable File")}</option>
                {files.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} {f.version ? `(${f.version})` : ""}
                  </option>
                ))}
              </select>
              <select
                className="select select-bordered select-sm flex-1"
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
              >
                <option value="">{t("Service")}</option>
                {services.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.serviceKey} v{c.version})
                  </option>
                ))}
              </select>
              <label className="flex cursor-pointer items-center gap-1">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-xs"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                />
                <span className="text-xs">{t("Default")}</span>
              </label>
              <button
                className={classNames("btn btn-primary btn-sm", {
                  loading: creating,
                })}
                disabled={!selectedFileId || !selectedServiceId}
                onClick={handleCreate}
              >
                {t("Add")}
              </button>
            </div>
          </div>

          {/* Existing bindings list */}
          <div>
            <h4 className="mb-2 text-sm font-semibold">
              {t("Existing Bindings")} ({bindings.length})
            </h4>
            {bindings.length === 0 ? (
              <div className="text-xs opacity-60">{t("No bindings yet")}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>{t("File")}</th>
                      <th>{t("Service")}</th>
                      <th>{t("Default")}</th>
                      <th>{t("Created")}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {bindings.map((b) => (
                        <tr key={b.id}>
                          <td className="font-mono text-xs">{b.id}</td>
                          <td className="text-sm">
                            {b.file?.name || `#${b.fileId}`}
                          </td>
                          <td className="text-sm">
                            {b.service?.title ||
                              b.service?.serviceKey ||
                              `#${b.serviceId}`}
                          </td>
                          <td>
                            {b.isDefault ? (
                              <span className="badge badge-primary badge-xs">
                                {t("Default")}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="text-xs">
                            {b.createdAt
                              ? new Date(b.createdAt).toLocaleString()
                              : "-"}
                          </td>
                          <td>
                            <button
                              className="btn btn-error btn-outline btn-xs"
                              onClick={() => handleDelete(b.id)}
                            >
                              {t("Delete")}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </ModalShell>
  );
};

export default BindingModal;
