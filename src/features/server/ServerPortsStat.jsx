import { useTranslation } from "react-i18next";
import classNames from "classnames";

const ServerPortsStat = ({ usedPorts, totalPorts, sshConnected }) => {
  const { t } = useTranslation();

  return (
    <div className={classNames("shadow-none stats bg-base-200")}>
      <div className="place-items-center">
        <div className="text-md font-extrabold flex flex-row items-center space-x-1">
          <span className="text-secondary-focus">{usedPorts}</span>
          <span className="text-neutral">/</span>
          <span className="text-secondary">{totalPorts}</span>
        </div>
      </div>
    </div>
  );
};

export default ServerPortsStat;
