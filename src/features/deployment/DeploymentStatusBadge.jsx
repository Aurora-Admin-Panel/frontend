import { useTranslation } from "react-i18next";

const statusStyles = {
  pending: "badge-warning",
  deploying: "badge-info",
  deployed: "badge-success",
  failed: "badge-error",
  stopped: "badge-ghost",
  removing: "badge-warning",
};

const DeploymentStatusBadge = ({ status }) => {
  const { t } = useTranslation();
  const style = statusStyles[status] || "badge-ghost";
  return (
    <span className={`badge badge-sm ${style}`}>
      {t(status || "unknown")}
    </span>
  );
};

export default DeploymentStatusBadge;
