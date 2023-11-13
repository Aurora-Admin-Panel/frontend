import { useRef } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { animate } from "framer-motion";
import Icon from "../Icon";

function Counter({ from, to }) {
  const nodeRef = useRef();

  useEffect(() => {
    const node = nodeRef.current;

    const controls = animate(from, to, {
      duration: 1,
      onUpdate(value) {
        node.textContent = value.toFixed(2);
      }
    });

    return () => controls.stop();
  }, [from, to]);

  return <p ref={nodeRef} />;
}

const ServerTrafficStat = ({
  downstreamTraffic,
  upstreamTraffic,
  sshConnected,
}) => {
  const { t } = useTranslation();

  return (
    <div className="stats shadow-none">
      <div className="stat grid-cols-2 place-items-center">
        <div className="stat-title">{t("Traffic")}</div>
        <div className="flex flex-col items-center text-xl font-bold text-accent">
          <span
            className={classNames(
              "flex flex-row items-center",
              sshConnected ? "text-accent-focus" : "text-accent-focus/50"
            )}
          >
            <Icon icon="ArrowUp" size={16} />
            {downstreamTraffic}
          </span>
          <span
            className={classNames(
              "flex flex-row items-center",
              sshConnected ? "text-accent-focus" : "text-accent-focus/50"
            )}
          >
            <Icon icon="ArrowDown" size={16} />
            {upstreamTraffic}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServerTrafficStat;
