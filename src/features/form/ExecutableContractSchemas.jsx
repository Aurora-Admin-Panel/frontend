import { gql, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus, Pencil } from "lucide-react";
import DataLoading from "../DataLoading";

const LIST_EXECUTABLE_CONTRACTS = gql`
  query ListExecutableContractsForSchemaPage($limit: Int, $offset: Int) {
    paginatedExecutableContracts(limit: $limit, offset: $offset) {
      count
      items {
        id
        contractKey
        version
        title
        description
        isActive
        updatedAt
      }
    }
  }
`;

const ExecutableContractSchemas = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data, loading, error, refetch } = useQuery(LIST_EXECUTABLE_CONTRACTS, {
    variables: { limit: 200, offset: 0 },
    fetchPolicy: "network-only",
  });

  const items = data?.paginatedExecutableContracts?.items ?? [];

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
          <h1 className="text-2xl font-bold">{t("Command Schemas")}</h1>
          <p className="text-sm opacity-70">
            {t("Browse saved schemas, then open one in the builder to edit and save.")}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm" onClick={() => refetch()} type="button">
            {t("Refresh")}
          </button>
          <button
            className="btn btn-primary btn-sm"
            type="button"
            onClick={() => navigate("/app/contracts/builder")}
          >
            <Plus size={14} />
            {t("New Schema")}
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
            <div className="p-6 text-sm opacity-70">{t("No schemas found.")}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>{t("Title")}</th>
                    <th>{t("Contract Key")}</th>
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
                      onClick={() => navigate(`/app/contracts/builder/${item.id}`)}
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
                      <td className="font-mono text-xs">{item.contractKey}</td>
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
                            navigate(`/app/contracts/builder/${item.id}`);
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

export default ExecutableContractSchemas;
