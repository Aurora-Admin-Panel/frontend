import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import ServerCard from "./ServerCard";
import ServerRow from "./ServerRow";
import { List, LayoutGrid } from "lucide-react";
import { gql, useQuery, useApolloClient } from "@apollo/client";

import { GET_SERVERS_QUERY } from "../../queries/server";
import Error from "../layout/Error";
import Paginator from "../Paginator";
import useQueryParams from "../../hooks/useQueryParams";
import { useAtom } from "jotai";
import serverLimitAtom from "../../atoms/server/limit";
import { useModal } from "../../atoms/modal";
import PageHeader from "../ui/PageHeader";

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
  const { open } = useModal();
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
  const client = useApolloClient();
  const [metricsMap, setMetricsMap] = useState({});
  useEffect(() => {
    const observable = client.subscribe({ query: SERVER_METRIC_SUBSCRIPTION });
    const sub = observable.subscribe({
      next({ data }) {
        if (data?.serverMetric) {
          const m = data.serverMetric;
          setMetricsMap((prev) => {
            if (prev[m.serverId] === m) return prev;
            return { ...prev, [m.serverId]: m };
          });
        }
      },
    });
    return () => sub.unsubscribe();
  }, [client]);
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
      <PageHeader
        title="Servers"
        onAdd={async () => {
          const result = await open("serverInfo");
          if (result) refetch();
        }}
      >
        <div className="tooltip tooltip-bottom" data-tip={t(listStyle)}>
          <label className="swap swap-flip text-9xl">
            <input
              type="checkbox"
              value={listStyle === "Cards view"}
              onClick={() => setListStyle(listStyle === "Cards view" ? "List view" : "Cards view")}
            />
            <div className="swap-on"><List size={20} /></div>
            <div className="swap-off"><LayoutGrid size={20} /></div>
          </label>
        </div>
      </PageHeader>

      {listStyle === "Cards view" ? (
        <>
          <div className="grid grid-cols-1 gap-5 px-4 pb-6 pt-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {(data?.paginatedServers?.items ?? []).map((server, i) => (
              <motion.div
                key={server.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.05,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <ServerCard server={server} refetch={refetch} metric={metricsMap[server.id]} />
              </motion.div>
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
                  (data?.paginatedServers?.items ?? []).map((server, i) => (
                    <ServerRow
                      key={server.id}
                      server={server}
                      refetch={refetch}
                      metric={metricsMap[server.id]}
                      index={i}
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
