import { useTranslation } from 'react-i18next';
import Icon from '../Icon';

const ServerTrafficStat = ({ downstreamTraffic, upstreamTraffic }) => {
    const { t } = useTranslation();

    return (
        <div className="shadow-none stats">
        <div className="stat place-items-center grid-cols-2">
          <div className="stat-title">{t("Traffic")}</div>
          <div className="flex flex-col items-center text-accent text-xl font-bold">
            <span className="flex flex-row items-center text-accent-focus"><Icon icon="ArrowUp" size={16} />{downstreamTraffic}</span>
            <span className="flex flex-row items-center text-accent-focus"><Icon icon="ArrowDown" size={16} />{upstreamTraffic}</span>
          </div>
        </div>
      </div>
    )
}

export default ServerTrafficStat;