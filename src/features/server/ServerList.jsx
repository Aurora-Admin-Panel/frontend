import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ServerCard from "./ServerCard";
import ServerRow from "./ServerRow";
import Icon from "../Icon";
import { gql, useQuery, useSubscription } from "@apollo/client";

import { GET_SERVERS_QUERY } from "../../quries/server";
import Error from "../layout/Error";
import Paginator from "../Paginator";
import useQueryParams from "../../hooks/useQueryParams";
import { useAtom } from "jotai";
import serverLimitAtom from "../../atoms/server/limit";
import { useModalReducer } from "../../atoms/modal";

const SERVER_METRIC_SUBSCRIPTION = gql`
subscription ServerMetric {
  serverMetric {
    cpuUtilPct
    fsRootUsedPct
    load15m
    load1m
    load5m
    memUsedPct
    netRxBps
    netTxBps
    serverId
    swapUsedPct
    time
    isOnline
  }
}
`;

const ServerList = () => {
  const { t } = useTranslation();
  const { showModal } = useModalReducer();
  const [atomLimit, setAtomLimit] = useAtom(serverLimitAtom);
  const [limit, offset, setQueryLimit, setOffset] = useQueryParams([
    {
      name: "limit",
      defaultValue: atomLimit,
      isNumeric: true,
      replace: false,
    },
    {
      name: "offset",
      defaultValue: 0,
      isNumeric: true,
      replace: false,
    },
  ]);
  const { data: metrics, loading: metricsLoading, error: metricsError } = useSubscription(SERVER_METRIC_SUBSCRIPTION);
  const { data, loading, error, refetch } = useQuery(
    GET_SERVERS_QUERY,
    { variables: { limit, offset } }
  );
  const [listStyle, setListStyle] = useState("List view");

  const setLimit = useCallback((value) => {
    setAtomLimit(value);
    setQueryLimit(value);
  }, [setAtomLimit, setQueryLimit]);

  if (error) return <Error error={error} />;
  return (
    <>
      <div className="flex-grow-1 container flex h-16 w-full flex-shrink-0 basis-16 flex-row items-center justify-between px-4 sm:px-8">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex flex-row items-center justify-start">
            <h2 className="not-prose text-2xl font-extrabold">{t("Servers")}</h2>
            <label
              className="modal-button btn btn-circle btn-primary btn-xs ml-2"
              onClick={() => showModal({ modalType: "serverInfo", onConfirm: refetch })}
            >
              <Icon icon="Plus" />
            </label>
          </div>
          <div className="flex flex-row items-center justify-end space-x-2">
            <div className="tooltip tooltip-bottom" data-tip={t(listStyle)}>
              <label className="swap swap-flip text-9xl">
                {/* this hidden checkbox controls the state */}
                <input
                  type="checkbox"
                  value={listStyle === "Cards view"}
                  onClick={() => setListStyle(listStyle === "Cards view" ? "List view" : "Cards view")}
                />

                <div className="swap-on"><Icon icon="ListDashes" size={20} /></div>
                <div className="swap-off"><Icon icon="Cards" size={20} /></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {listStyle === "Cards view" ? (
        <>
          <div className="grid grid-cols-1 gap-6 px-2 pb-4 pt-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {(data?.paginatedServers?.items ?? []).map((server) => (
              <ServerCard key={server.id} server={server} refetch={refetch} />
            ))}
          </div>
          <Paginator
            isLoading={loading}
            count={data?.paginatedServers?.count}
            limit={limit}
            offset={offset}
            setLimit={setLimit}
            setOffset={setOffset}
          ></Paginator>
        </>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table border-separate border-spacing-y-3 table-fixed max-w-screen-lg px-1 mx-auto">
              <thead className="text-center">
                <tr>
                  <th className="w-32 sticky left-0 z-10 bg-base-100">
                    {t("Name")}
                  </th>
                  <th className="w-16">{t("SSH")}</th>
                  <th className="w-16">{t("Ports")}</th>
                  <th className="w-16">{t("Traffic")}</th>
                  <th className="w-28">{t("Address")}</th>
                  <th className="w-12">{t("CPU")}</th>
                  <th className="w-12">{t("Mem")}</th>
                  <th className="w-12">{t("Disk")}</th>
                  <th className="w-16 sticky right-0 z-10 bg-base-100">{t("Actions")}</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {loading ? (
                  Array.from(Array(limit)).map((_, i) => (
                    <tr key={i} className="w-full">
                      <td className="h-20 w-full skeleton" colSpan={9}></td>
                    </tr>
                  ))
                ) : (
                  (data?.paginatedServers?.items ?? []).map((server) => (
                    <ServerRow
                      key={server.id}
                      server={server}
                      refetch={refetch}
                      metric={!metricsLoading && metrics && metrics.serverMetric && metrics.serverMetric.serverId === server.id ? metrics.serverMetric : null}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex w-full flex-row justify-end mx-auto max-w-screen-lg mx-auto">
            <Paginator
              isLoading={loading}
              count={data?.paginatedServers?.count}
              limit={limit}
              offset={offset}
              setLimit={setLimit}
              setOffset={setOffset}
            ></Paginator>

          </div>
        </>
      )}
    </>
  );
};

export default ServerList;
