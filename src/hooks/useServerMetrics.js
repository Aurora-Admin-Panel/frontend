import { useEffect, useMemo, useState } from "react";
import { gql, useQuery } from "@apollo/client";

const SERVER_METRICS_QUERY = gql`
query ServerMetricsQuery($serverId: Int!, $start: DateTime!) {
  serverMetricSeries(serverId: $serverId, tr: {start: $start}) {
    time
    cpuUtilPct
    memUsedPct
    netRxBps
    netTxBps
  }
}
`;
const QUERY_START_INTERVAL = 1000 * 60 * 10;

const useServerMetrics = (serverId, metric) => {
  const startAt = useMemo(() => new Date(Date.now() - QUERY_START_INTERVAL), [serverId]);
  const { data, loading, error, refetch } = useQuery(SERVER_METRICS_QUERY, {
    variables: {
      serverId,
      start: startAt,
    },
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
    skip: !serverId,
    notifyOnNetworkStatusChange: false,
    returnPartialData: true,
  });

  // Keep series aligned by refetching the window every 10 minutes
  useEffect(() => {
    if (!serverId) return;
    const id = setInterval(() => {
      refetch({ serverId, start: new Date(Date.now() - QUERY_START_INTERVAL) });
    }, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, [serverId, refetch]);

  const [cpuPts, setCpuPts] = useState([]); // {t:number, v:number}[]
  const [memPts, setMemPts] = useState([]);
  const [rxPts, setRxPts] = useState([]);
  const [txPts, setTxPts] = useState([]);
  const [lastTs, setLastTs] = useState(null); // ms epoch

  // Seed from query data
  useEffect(() => {
    const pts = Array.isArray(data?.serverMetricSeries) ? data.serverMetricSeries : [];
    if (!pts.length) return;
    const mapSeries = (key) =>
      pts
        .filter((p) => typeof p?.[key] === "number" && p.time)
        .map((p) => ({ t: new Date(p.time).getTime(), v: p[key] }));
    const cpu = mapSeries("cpuUtilPct");
    const mem = mapSeries("memUsedPct");
    const rx = mapSeries("netRxBps");
    const tx = mapSeries("netTxBps");
    const latest = Math.max(
      cpu.at(-1)?.t ?? 0,
      mem.at(-1)?.t ?? 0,
      rx.at(-1)?.t ?? 0,
      tx.at(-1)?.t ?? 0
    );
    setCpuPts(cpu);
    setMemPts(mem);
    setRxPts(rx);
    setTxPts(tx);
    if (latest) setLastTs(latest);
  }, [data?.serverMetricSeries]);

  // Append live snapshot and trim to rolling window
  useEffect(() => {
    if (!metric || metric.serverId !== serverId || !metric.time) return;
    const t = new Date(metric.time).getTime();
    if (lastTs && t <= lastTs) return;
    const cutoff = Date.now() - QUERY_START_INTERVAL;
    const pushIfNum = (setter, val) => {
      if (typeof val === "number") {
        setter((arr) => [...arr.filter((p) => p.t >= cutoff), { t, v: val }]);
      } else {
        setter((arr) => arr.filter((p) => p.t >= cutoff));
      }
    };
    pushIfNum(setCpuPts, metric.cpuUtilPct);
    pushIfNum(setMemPts, metric.memUsedPct);
    pushIfNum(setRxPts, metric.netRxBps);
    pushIfNum(setTxPts, metric.netTxBps);
    setLastTs(t);
  }, [metric, serverId, lastTs]);

  const cpuSeries = useMemo(() => cpuPts.map((p) => p.v), [cpuPts]);
  const memSeries = useMemo(() => memPts.map((p) => p.v), [memPts]);
  const rxSeries = useMemo(() => rxPts.map((p) => p.v), [rxPts]);
  const txSeries = useMemo(() => txPts.map((p) => p.v), [txPts]);

  return { cpuSeries, memSeries, rxSeries, txSeries, loading, error };
};

export default useServerMetrics;
