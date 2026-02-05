import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { ArrowUp, ArrowDown } from "lucide-react";
import { getReadableSize } from "../../utils/formatter";

const ServerTrafficStat = ({
  uploadTotal,
  downloadTotal,
  sshConnected,
}) => {
  const { t } = useTranslation();

  return (
    <div className={classNames("shadow-none")}>
      <div className="grid-cols-2 place-items-center">
        <div className="flex flex-col items-center text-md font-bold text-accent">
          <span
            className={classNames(
              "flex flex-row items-center",
              sshConnected ? "text-accent-focus" : "text-accent-focus/50"
            )}
          >
            <ArrowUp size={16} />
            {getReadableSize(downloadTotal)}
          </span>
          <span
            className={classNames(
              "flex flex-row items-center",
              sshConnected ? "text-accent-focus" : "text-accent-focus/50"
            )}
          >
            <ArrowDown size={16} />
            {getReadableSize(uploadTotal)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServerTrafficStat;
