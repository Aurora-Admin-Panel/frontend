import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@apollo/client";
import classNames from "classnames";
import { getReadableSize } from "../../utils/formatter";
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

const BindingModal = ({ modalProps, close, resolve }) => {
  const { t } = useTranslation();
  const { confirm } = useModal();

  const fileId = modalProps?.fileId ?? null;
  const serviceId = modalProps?.serviceId ?? null;
  const isFileMode = fileId !== null;

  const [selectedBindingId, setSelectedBindingId] = useState(null);
  const [addValue, setAddValue] = useState("");

  // Always fetch bindings filtered by the known side
  const { data: bindingsData, loading: bindingsLoading, refetch } = useQuery(
    GET_SERVICE_BINDINGS,
    {
      variables: {
        ...(fileId && { fileId }),
        ...(serviceId && { serviceId }),
      },
    }
  );

  // Fetch the "other side" options for the add dropdown
  const { data: filesData, loading: filesLoading } = useQuery(
    GET_EXECUTABLE_FILES,
    { skip: isFileMode } // Only need files list when in service mode
  );
  const { data: servicesData, loading: servicesLoading } = useQuery(
    GET_SERVICES_FOR_BINDING,
    { skip: !isFileMode } // Only need services list when in file mode
  );

  const [createBinding, { loading: creating }] = useMutation(CREATE_SERVICE_BINDING);
  const [deleteBinding] = useMutation(DELETE_SERVICE_BINDING);

  const bindings = bindingsData?.serviceBindings ?? [];
  const files = filesData?.files ?? [];
  const services = servicesData?.serviceDefinitions ?? [];

  // Derive the modal title from the first binding's known-side data
  // (or fall back to a generic title)
  const deriveTitle = () => {
    if (isFileMode) {
      const name = modalProps?.fileName;
      const version = modalProps?.fileVersion;
      if (name) return `${name}${version ? ` (${version})` : ""}`;
      return t("File Bindings");
    } else {
      const title = modalProps?.serviceTitle;
      if (title) return title;
      return t("Service Bindings");
    }
  };

  const handleAdd = async () => {
    if (!addValue) return;
    await createBinding({
      variables: {
        fileId: isFileMode ? fileId : Number(addValue),
        serviceId: isFileMode ? Number(addValue) : serviceId,
      },
    });
    setAddValue("");
    refetch();
  };

  const handleRemove = async () => {
    if (!selectedBindingId) return;
    const confirmed = await confirm({
      title: t("Remove Binding"),
      message: t("Are you sure you want to remove this binding?"),
    });
    if (!confirmed) return;
    await deleteBinding({ variables: { id: selectedBindingId } });
    setSelectedBindingId(null);
    refetch();
  };

  const handleClose = () => {
    if (resolve) resolve(true);
    close();
  };

  const isLoading = bindingsLoading || filesLoading || servicesLoading;

  // Build dropdown options (the "other side")
  const dropdownOptions = isFileMode
    ? services.map((s) => ({
        value: s.id,
        label: `${s.title} (${s.serviceKey} v${s.version})`,
      }))
    : files.map((f) => ({
        value: f.id,
        label: `${f.name}${f.version ? ` (${f.version})` : ""}`,
      }));

  return (
    <ModalShell
      title={deriveTitle()}
      onClose={handleClose}
      maxWidth="max-w-md"
    >
      {isLoading ? (
        <div className="py-8">
          <DataLoading />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Bindings list */}
          {bindings.length === 0 ? (
            <div className="py-6 text-center text-sm opacity-50">
              {t("No bindings yet")}
            </div>
          ) : (
            <div className="space-y-0 divide-y divide-base-content/[0.06]">
              {bindings.map((b) => (
                <div
                  key={b.id}
                  className={classNames(
                    "flex cursor-pointer items-center justify-between px-3 py-2.5 rounded-lg transition-colors",
                    selectedBindingId === b.id
                      ? "bg-primary/10"
                      : "hover:bg-base-200"
                  )}
                  onClick={() =>
                    setSelectedBindingId(
                      selectedBindingId === b.id ? null : b.id
                    )
                  }
                >
                  {isFileMode ? (
                    /* Show the service side */
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium truncate">
                        {b.service?.title || `Service #${b.serviceId}`}
                      </span>
                      <span className="badge badge-ghost badge-xs font-mono shrink-0">
                        {b.service?.serviceKey}
                      </span>
                      {b.service?.version && (
                        <span className="text-xs opacity-50 shrink-0">
                          v{b.service.version}
                        </span>
                      )}
                    </div>
                  ) : (
                    /* Show the file side */
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium truncate">
                        {b.file?.name || `File #${b.fileId}`}
                      </span>
                      {b.file?.version && (
                        <span className="text-xs opacity-50 shrink-0">
                          v{b.file.version}
                        </span>
                      )}
                      {b.file?.size && (
                        <span className="text-xs opacity-40 shrink-0">
                          {getReadableSize(b.file.size)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add new binding */}
          <div className="flex items-center gap-2">
            <select
              className="select select-bordered select-sm flex-1"
              value={addValue}
              onChange={(e) => setAddValue(e.target.value)}
            >
              <option value="">
                {isFileMode ? t("Select a service...") : t("Select a file...")}
              </option>
              {dropdownOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              className={classNames("btn btn-primary btn-sm", {
                loading: creating,
              })}
              disabled={!addValue}
              onClick={handleAdd}
            >
              {t("Add")}
            </button>
          </div>

          {/* Remove button — only visible when a binding is selected */}
          {selectedBindingId && (
            <div className="flex justify-end">
              <button
                className="btn btn-error btn-outline btn-sm"
                onClick={handleRemove}
              >
                {t("Remove")}
              </button>
            </div>
          )}
        </div>
      )}
    </ModalShell>
  );
};

export default BindingModal;
