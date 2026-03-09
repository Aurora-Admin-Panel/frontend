import { gql, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus, Pencil, Link as LinkIcon } from "lucide-react";
import DataLoading from "../DataLoading";
import { useModal } from "../../atoms/modal";

const LIST_SERVICE_DEFINITIONS = gql`
  query ListServiceDefinitionsForPage($limit: Int, $offset: Int) {
    paginatedServiceDefinitions(limit: $limit, offset: $offset) {
      count
      items {
        id
        serviceKey
        version
        title
        description
        isActive
        updatedAt
      }
    }
  }
`;

const ServiceListPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { open } = useModal();
  const { data, loading, error, refetch } = useQuery(LIST_SERVICE_DEFINITIONS, {
    variables: { limit: 200, offset: 0 },
    fetchPolicy: "network-only",
  });

  const items = data?.paginatedServiceDefinitions?.items ?? [];

  if (error) {
    return (
      <div className="px-4 py-4">
        <div className="alert alert-error">
          <span>{String(error.message || error)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 py-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("Service Definitions")}</h1>
          <p className="text-sm opacity-70">
            {t("Browse saved services, then open one in the editor to edit and save.")}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm" onClick={() => refetch()} type="button">
            {t("Refresh")}
          </button>
          <button
            className="btn btn-primary btn-sm"
            type="button"
            onClick={() => navigate("/app/services/editor")}
          >
            <Plus size={14} />
            {t("Service Editor")}
          </button>
        </div>
      </div>

      <div className="card bg-base-200 shadow-md">
        <div className="card-body p-0">
          {loading ? (
            <div className="p-6">
              <DataLoading />
            </div>
          ) : items.length === 0 ? (
            <div className="p-6 text-sm opacity-70">{t("No services found.")}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>{t("Title")}</th>
                    <th>{t("Service Key")}</th>
                    <th>{t("Version")}</th>
                    <th>{t("Status")}</th>
                    <th>{t("Updated")}</th>
                    <th className="text-right">{t("Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="cursor-pointer hover"
                      onClick={() => navigate(`/app/services/editor/${item.id}`)}
                    >
                      <td>{item.id}</td>
                      <td>
                        <div className="font-semibold">{item.title || "-"}</div>
                        {item.description ? (
                          <div className="max-w-md truncate text-xs opacity-70">
                            {item.description}
                          </div>
                        ) : null}
                      </td>
                      <td className="font-mono text-xs">{item.serviceKey}</td>
                      <td>{item.version}</td>
                      <td>
                        <span className={`badge badge-sm ${item.isActive ? "badge-success" : "badge-ghost"}`}>
                          {item.isActive ? t("Active") : t("Inactive")}
                        </span>
                      </td>
                      <td className="text-xs">
                        {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "-"}
                      </td>
                      <td className="text-right">
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            open("binding", { serviceId: item.id, serviceTitle: item.title || item.serviceKey });
                          }}
                        >
                          <LinkIcon size={14} />
                          {t("Bindings")}
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/app/services/editor/${item.id}`);
                          }}
                        >
                          <Pencil size={14} />
                          {t("Open")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceListPage;
