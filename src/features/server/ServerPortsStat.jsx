import { useTranslation } from "react-i18next";

const ServerPortsStat = ({ usedPorts, totalPorts }) => {
  const { t } = useTranslation();

  return (
    <div className="shadown-none stats w-48">
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
