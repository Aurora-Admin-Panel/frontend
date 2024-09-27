import { useTranslation } from "react-i18next";
import classNames from "classnames";

const ServerPortsStat = ({ usedPorts, totalPorts, sshConnected }) => {
  const { t } = useTranslation();

  return (
    <div className={classNames("shadow-none stats", sshConnected === false ? "bg-base-200" : "")}>
      <div className="stat place-items-center">
        <div className="stat-title">{t("Ports")}</div>
        <div className="text-xl font-extrabold">
          <span className="text-secondary-focus">{usedPorts}</span>
          <span className="text-neutral">/</span>
          <span className="text-secondary">{totalPorts}</span>
        </div>
      </div>
    </div>
  );
};

export default ServerPortsStat;
