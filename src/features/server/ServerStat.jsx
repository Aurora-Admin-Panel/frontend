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

const Stat = ({ color, value, loading, completed }) => {
  const { t } = useTranslation();
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (scope.current) {
      animate(scope.current, { opacity: [0, 1, 0.6] }, { duration: 5 });
    }
  }, [value]);

  return (
    <div className="place-items-center">
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
        <div className={`text-${color} text-sm`} ref={scope}>
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
    <>
      <td className="text-center p-2">
        <Stat
          color="success"
          value={data?.serverUsage?.cpu}
          loading={loading}
          completed={completed}
        />
      </td>
      <td className="text-center p-2">
        <Stat
          color="warning"
          value={data?.serverUsage?.memory}
          loading={loading}
          completed={completed}
        />
      </td>
      <td className="text-center p-2">
        <Stat
          color="error"
          value={data?.serverUsage?.disk}
          loading={loading}
          completed={completed}
        />
      </td>
    </>
  );
};

export default ServerStat;
