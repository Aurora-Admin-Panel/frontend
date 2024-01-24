import { useRef } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { animate } from "framer-motion";
import { gql, useQuery } from "@apollo/client";
import Icon from "../Icon";
import { getReadableSize } from "../../utils/formatter";

const GET_SERVER_TRAFFIC_QUERY = gql`
  query GetServerTraffic($serverId: Int!) {
    server(id: $serverId) {
      uploadTotal
      downloadTotal
    }
  }
`;

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
  serverId,
  uploadTotal,
  downloadTotal,
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
            {getReadableSize(downloadTotal)}
          </span>
          <span
            className={classNames(
              "flex flex-row items-center",
              sshConnected ? "text-accent-focus" : "text-accent-focus/50"
            )}
          >
            <Icon icon="ArrowDown" size={16} />
            {getReadableSize(uploadTotal)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServerTrafficStat;
