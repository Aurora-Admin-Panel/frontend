import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReactLoading from "react-loading";
import { gql, useQuery, NetworkStatus, useApolloClient } from "@apollo/client";
import classNames from "classnames";
import useSubscribe from "@/hooks/useSubscribe";
import Icon from "../Icon";
import { use } from "i18next";

const CONNECT_SERVER_SUBSCRIPTION = gql`
  subscription ConnectServer($serverId: Int!) {
    connectServer(serverId: $serverId)
  }
`;

const ServerSSHStat = ({ server, sshConnected, setSSHConnected, registerSSHRefetch }) => {
  const { t } = useTranslation();
  const { data, loading, error, subscribe } = useSubscribe(
    CONNECT_SERVER_SUBSCRIPTION,
    { serverId: server.id }
  );
  useEffect(() => {
    if (!sshConnected) {
      subscribe();
    }
  }, [server.id]);
  useEffect(() => {
    if (loading) setSSHConnected(null);
    else if (data && data.connectServer.success) {
      setSSHConnected(true);
    } else {
      setSSHConnected(false);
    }
  }, [data, loading]);
  useEffect(() => {
    registerSSHRefetch(() => {
      return subscribe;
    });
  }, [registerSSHRefetch]);

  return (
    <div className={classNames("overflow-x-visible shadow-nones")}>
      <div className="place-items-center">
        <div className="group relative">
          {loading ? (
            <button
              className="stat-value tooltip cursor-not-allowed"
              data-tip={t("Connecting")}
            >
              <ReactLoading
                type="spinningBubbles"
                className="fill-primary"
                style={{ height: 24, width: 24 }}
              />
            </button>
          ) : error || (data && data.connectServer.error) ? (
            <>
              <div className="alert absolute left-1/2 z-50 hidden w-96 max-w-screen-sm -translate-x-1/2 -translate-y-full transform rounded-xl shadow-2xl transition duration-200 group-hover:block">
                <div>
                  <span>
                    {error ? JSON.stringify(error) : data.connectServer.error}
                  </span>
                </div>
              </div>
              <button className="stat-value" onClick={() => subscribe()}>
                <Icon icon="WarningCircle" className="text-error" />
              </button>
            </>
          ) : data && data.connectServer.success ? (
            <button className="stat-value" onClick={() => subscribe()}>
              <Icon icon="CheckCircle" className="text-success" />
            </button>
          ) : null}
        </div>
      </div>
      {/* ) : (
        <div className="stat place-items-center">
          <div className="stat-title">{t("SSH")}</div>
          <button className="stat-value tooltip" data-tip="hello">
            <Icon icon="WarningCircle" className="text-error" />
          </button>
        </div>
      )} */}
    </div>
  );
};

export default ServerSSHStat;
