import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactLoading from "react-loading";
import { useSubscription, gql } from "@apollo/client";
import classNames from "classnames";
import { motion, useAnimate } from "framer-motion";
import Icon from "../Icon";
import { shallowEqual } from "react-redux";

const SERVER_USAGE_SUBSCRIPTION = gql`
  subscription ServerUsage($serverId: Int!) {
    serverUsage(serverId: $serverId) {
      cpu
      memory
      disk
    }
  }
`;

const Stat = ({ title, color, value, loading, completed }) => {
  const { t } = useTranslation();
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (scope.current) {
      animate(scope.current, { opacity: [0, 1, 0.6] }, { duration: 5 });
    }
  }, [value]);

  return (
    <div className="stat place-items-center">
      <div className="stat-title">{t(title)}</div>
      {completed || value === null || value === undefined ? (
        <Icon icon="Prohibit" className="text-netural opacity-60" />
      ) : loading ? (
        <div className="stat-value">
          <ReactLoading
            type="spinningBubbles"
            className={`fill-${color}`}
            style={{ height: 16, width: 16 }}
          />
        </div>
      ) : (
        <div className={`stat-desc text-${color}`} ref={scope}>
          {value}%
        </div>
      )}
    </div>
  );
};

const ServerStat = ({ serverId, sshConnected }) => {
  const { data, loading, error } = useSubscription(SERVER_USAGE_SUBSCRIPTION, {
    variables: {
      serverId,
    },
    onComplete: () => {
      setCompleted(true);
    },
  });
  const [completed, setCompleted] = useState(false);

  if (error) return <Error error={error} />;

  return (
    <div className="flex flex-row items-center">
      <div className={(classNames("stats shadow-none", sshConnected === false ? "bg-base-200" : ""))}>
        <Stat
          title="CPU"
          color="success"
          value={data?.serverUsage?.cpu}
          loading={loading}
          completed={completed}
        />
        <Stat
          title="Mem"
          color="warning"
          value={data?.serverUsage?.memory}
          loading={loading}
          completed={completed}
        />
        <Stat
          title="Disk"
          color="error"
          value={data?.serverUsage?.disk}
          loading={loading}
          completed={completed}
        />
      </div>
    </div>
  );
};

export default ServerStat;
