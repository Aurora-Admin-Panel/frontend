import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { Rocket, Eye, ArrowLeft } from "lucide-react";
import Paginator from "../Paginator";
import DataLoading from "../DataLoading";
import useQueryParams from "../../hooks/useQueryParams";
import { useModal } from "../../atoms/modal";
import { GET_PAGINATED_SERVER_DEPLOYMENTS } from "../../queries/deployment";
import DeploymentStatusBadge from "./DeploymentStatusBadge";
import PageHeader from "../ui/PageHeader";

const DeploymentList = () => {
  const { t } = useTranslation();
  const { open } = useModal();
  const { serverId } = useParams();
  const navigate = useNavigate();
  const serverIdNum = Number(serverId);
  const [limit, offset, setLimit, setOffset] = useQueryParams([
    { name: "limit", defaultValue: 20, isNumeric: true, replace: false },
    { name: "offset", defaultValue: 0, isNumeric: true, replace: false },
  ]);

  const { loading, data, refetch } = useQuery(GET_PAGINATED_SERVER_DEPLOYMENTS, {
    variables: { limit, offset, serverId: serverIdNum },
    fetchPolicy: "cache-and-network",
  });

  const items = data?.paginatedServerDeployments?.items ?? [];

  const handleDeploy = async () => {
    const result = await open("deploy", { serverId: serverIdNum });
    if (result) refetch();
  };

  return (
    <>
      <PageHeader
        title={
          <>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate("/app/servers")}
              type="button"
            >
              <ArrowLeft size={16} />
              {t("Back")}
            </button>
            <h1 className="not-prose text-2xl font-extrabold">{t("Deployments")}</h1>
          </>
        }
        onAdd={handleDeploy}
      >
        <button
          className="btn btn-outline btn-sm"
          onClick={() => navigate(`/app/servers/${serverId}/ports`)}
          type="button"
        >
          {t("Ports")}
        </button>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => refetch()}
          type="button"
        >
          {t("Refresh")}
        </button>
        <button
          className="btn btn-primary btn-sm"
          onClick={handleDeploy}
          type="button"
        >
          <Rocket size={14} />
          {t("Deploy")}
        </button>
      </PageHeader>

      <div className="mx-auto w-full max-w-screen-2xl px-4">
        <div className="card bg-base-200 shadow-md">
          <div className="card-body p-0">
            {loading && !data ? (
              <div className="p-6">
                <DataLoading />
              </div>
            ) : items.length === 0 ? (
              <div className="p-6 text-sm opacity-70">{t("No deployments yet")}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>{t("App")}</th>
                      <th>{t("Port")}</th>
                      <th>{t("Status")}</th>
                      <th>{t("Updated")}</th>
                      <th className="text-right">{t("Actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((dep) => (
                      <tr key={dep.id} className="hover">
                        <td className="font-mono text-xs">{dep.id}</td>
                        <td className="text-xs">
                          {dep.serviceTitle || (dep.serviceBindingId ? `#${dep.serviceBindingId}` : "-")}
                        </td>
                        <td>
                          {dep.port ? (
                            <span className="badge badge-outline badge-sm">
                              {t("Port")} {dep.port.num}
                              {dep.port.externalNum && dep.port.externalNum !== dep.port.num
                                ? ` (${dep.port.externalNum})`
                                : ""}
                            </span>
                          ) : (
                            <span className="text-xs opacity-40">-</span>
                          )}
                        </td>
                        <td>
                          <DeploymentStatusBadge status={dep.status} />
                        </td>
                        <td className="text-xs">
                          {dep.updatedAt
                            ? new Date(dep.updatedAt).toLocaleString()
                            : "-"}
                        </td>
                        <td className="text-right">
                          <button
                            type="button"
                            className="btn btn-ghost btn-xs"
                            onClick={async () => {
                              const result = await open("deploymentDetail", {
                                deploymentId: dep.id,
                              });
                              if (result) refetch();
                            }}
                          >
                            <Eye size={14} />
                            {t("Detail")}
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
        <Paginator
          isLoading={loading}
          count={data?.paginatedServerDeployments?.count}
          limit={limit}
          offset={offset}
          setLimit={setLimit}
          setOffset={setOffset}
        />
      </div>
    </>
  );
};

export default DeploymentList;
