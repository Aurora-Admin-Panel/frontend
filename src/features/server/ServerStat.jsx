import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactLoading from "react-loading";
import { useSubscription, gql } from "@apollo/client";
import { motion, useAnimate } from "framer-motion";
import Icon from "../Icon";

const SERVER_USAGE_SUBSCRIPTION = gql`
  subscription ServerUsage($serverId: Int!) {
    serverUsage(serverId: $serverId) {
      cpu
      memory
      disk
    }
  }
`;

const ServerStat = ({ serverId }) => {
  const { t } = useTranslation();
  const [scope0, animate0] = useAnimate();
  const [scope1, animate1] = useAnimate();
  const [scope2, animate2] = useAnimate();
  const [completed, setCompleted] = useState(false);
  const { data, loading, error } = useSubscription(SERVER_USAGE_SUBSCRIPTION, {
    variables: {
      serverId,
    },
    onComplete: () => {
      setCompleted(true);
    },
  });
  useEffect(() => {
    if (scope0.current) {
      animate0(scope0.current, { opacity: [0, 1, 0.6] }, { duration: 5 });
    }
    if (scope1.current) {
      animate1(scope1.current, { opacity: [0, 1, 0.6] }, { duration: 5 });
    }
    if (scope2.current) {
      animate2(scope2.current, { opacity: [0, 1, 0.6] }, { duration: 5 });
    }
  }, [data]);

  if (error) return <Error error={error} />;

  return (
    <div className="flex flex-row items-center">
      <div className="stats shadow-none">
        <div className="stat place-items-center">
          <div className="stat-title">{t("CPU")}</div>
          {completed ? (
            <Icon icon="Prohibit" className="text-netural opacity-60" />
          ) : loading ? (
            <div className="stat-value">
              <ReactLoading
                type="spinningBubbles"
                className="fill-success"
                style={{ height: 16, width: 16 }}
              />
            </div>
          ) : (
            <div className="stat-desc text-success" ref={scope0}>
              {data.serverUsage.cpu}%
            </div>
          )}
        </div>
        <div className="stat place-items-center">
          <div className="stat-title">{t("Mem")}</div>
          {completed ? (
            <Icon icon="Prohibit" className="text-netural opacity-60" />
          ) : loading ? (
            <div className="stat-value">
              <ReactLoading
                type="spinningBubbles"
                className="fill-warning"
                style={{ height: 16, width: 16 }}
              />
            </div>
          ) : (
            <div className="stat-desc text-warning" ref={scope1}>
              {data.serverUsage.memory}%
            </div>
          )}
        </div>
        <div className="stat place-items-center">
          <div className="stat-title">{t("Disk")}</div>
          {completed ? (
            <Icon icon="Prohibit" className="text-netural opacity-60" />
          ) : loading ? (
            <div className="stat-value">
              <ReactLoading
                type="spinningBubbles"
                className="fill-error"
                style={{ height: 16, width: 16 }}
              />
            </div>
          ) : (
            <div className="stat-desc text-error" ref={scope2}>
              {data.serverUsage.disk}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServerStat;
