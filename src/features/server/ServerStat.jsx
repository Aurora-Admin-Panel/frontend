import { useTranslation } from "react-i18next";


const ServerStat = ({ cpuStat, memStat, diskStat }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-row items-center">
      <div className="shadow-none stats">
        <div className="stat place-items-center">
          <div className="stat-title">{t("CPU")}</div>
          <div className="stat-desc text-success">{cpuStat}</div>
        </div>
        <div className="stat place-items-center">
          <div className="stat-title">{t("Mem")}</div>
          <div className="stat-desc text-warning">{memStat}</div>
        </div>
        <div className="stat place-items-center">
          <div className="stat-title">{t("Disk")}</div>
          <div className="stat-desc text-error">{diskStat}</div>
        </div>
      </div>
    </div>
  );
};

export default ServerStat;
