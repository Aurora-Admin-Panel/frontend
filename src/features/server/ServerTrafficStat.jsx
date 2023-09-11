import { useTranslation } from 'react-i18next';

const ServerTrafficStat = ({ downstreamTraffic, upstreamTraffic }) => {
    const { t } = useTranslation();

    return (
        <div className="shadown-none stats w-48">
        <div className="stat place-items-center">
          <div className="stat-title">{t("Traffic")}</div>
          <div className=" text-accent text-xl font-bold">
            <span className="text-accent-focus">↘{downstreamTraffic}</span>
            <span className="text-accent-focus">↗{upstreamTraffic}</span>
          </div>
        </div>
      </div>
    )
}

export default ServerTrafficStat;