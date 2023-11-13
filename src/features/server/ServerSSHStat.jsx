import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReactLoading from "react-loading";
import { gql, useQuery, NetworkStatus } from "@apollo/client";
import Icon from "../Icon";

const CONNECT_SERVER_QUERY = gql`
  query ConnectServer($serverId: Int!) {
    connectServer(serverId: $serverId)
  }
`;

const ServerSSHStat = ({ serverId, setSSHConnected, registerSSHRefetch }) => {
  const { t } = useTranslation();
  const { data, loading, error, refetch, networkStatus } = useQuery(
    CONNECT_SERVER_QUERY,
    // TODO: check https://www.apollographql.com/docs/react/data/queries#nextfetchpolicy
    {
      variables: { serverId },
      notifyOnNetworkStatusChange: true,
    }
  );
  useEffect(() => {
    if (data && data.connectServer.success) {
      setSSHConnected(true);
    } else {
      setSSHConnected(false);
    }
  }, [data]);
  useEffect(() => {
    registerSSHRefetch(() => {
      return refetch;
    });
  }, [registerSSHRefetch]);

  return (
    <div className="stats overflow-x-visible shadow-none">
      <div className="stat place-items-center">
        <div className="stat-title">{t("SSH")}</div>
        <div className="group relative">
          {loading || networkStatus === NetworkStatus.refetch ? (
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
          ) : error || data.connectServer.error ? (
            <>
              <div className="alert absolute left-1/2 z-50 hidden w-96 max-w-screen-sm -translate-x-1/2 -translate-y-full transform rounded-xl shadow-2xl transition duration-200 group-hover:block">
                <div>
                  <span>
                    {JSON.stringify(error) || data.connectServer.error}
                  </span>
                </div>
              </div>
              <button className="stat-value" onClick={() => refetch()}>
                <Icon icon="WarningCircle" className="text-error" />
              </button>
            </>
          ) : data.connectServer.success ? (
            <button className="stat-value" onClick={() => refetch()}>
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
