import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactLoading from "react-loading";
import { useSubscription, gql, useQuery } from "@apollo/client";
import classNames from "classnames";
import { motion, useAnimate } from "framer-motion";
import { Chart } from "./chart/Chart";
import Icon from "../Icon";
import {
  Cpu,
  Gauge,
  HardDrive,
  Activity,
  TrendingUp,
  TrendingDown,
  CircleAlert,
  CircleHelp
} from "lucide-react";
import { shallowEqual } from "react-redux";
import { formatGraphQLError } from "@/utils/error";

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
`
const QUERY_START_INTERVAL = 1000 * 60 * 10;

const ServerStat = ({ serverId, sshConnected, metric }) => {
  const { t } = useTranslation();
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

  // Append live snapshot and trim to rolling 1h window
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

  const isEmptyCPU = !loading && !error && cpuSeries.length === 0;
  const isEmptyMEM = !loading && !error && memSeries.length === 0;
  const isEmptyNET = !loading && !error && rxSeries.length === 0 && txSeries.length === 0;
  // Dynamic accent by usage for CPU
  const colorByPct = (pct) => {
    if (pct == null || Number.isNaN(pct)) return "text-neutral-400";
    if (pct >= 85) return "text-red-500";
    if (pct >= 65) return "text-amber-500";
    return "text-emerald-500";
  };
  // Distinct palette for Memory so it doesn't match CPU under threshold
  const memColorByPct = (pct) => {
    if (pct == null || Number.isNaN(pct)) return "text-neutral-300";
    if (pct >= 85) return "text-red-400";
    if (pct >= 65) return "text-amber-400";
    return "text-sky-500"; // cool tone when healthy
  };
  const cpuLatest = cpuSeries.length ? cpuSeries[cpuSeries.length - 1] : null;
  const memLatest = memSeries.length ? memSeries[memSeries.length - 1] : null;
  const cpuAccent = colorByPct(cpuLatest);
  const memAccent = memColorByPct(memLatest);
  return (
    <>
      <td className="text-center p-2">
        {error ? (
          <div className="w-full h-20 flex items-center justify-center">
            <div className="tooltip tooltip-bottom" data-tip={formatGraphQLError(error)}>
              <CircleAlert className="text-error" size={20} />
            </div>
          </div>
        ) : loading ? (
          <div className="w-full h-20 skeleton rounded-box" />
        ) : isEmptyCPU ? (
          <div className="w-full h-20 flex items-center justify-center">
            <div className="tooltip tooltip-bottom" data-tip={t("No data available")}>
              <CircleHelp className="text-base-content/60" size={18} />
            </div>
          </div>
        ) : (
          <Chart
            value={Math.round(cpuSeries[cpuSeries.length - 1] ?? 0)}
            unit={"%"}
            data={cpuSeries}
            labelA={t("CPU")}
            accent={cpuAccent}
          />
        )}
      </td>
      <td className="text-center p-2">
        {error ? (
          <div className="w-full h-20 flex items-center justify-center">
            <div className="tooltip tooltip-bottom" data-tip={formatGraphQLError(error)}>
              <CircleAlert className="text-error" size={20} />
            </div>
          </div>
        ) : loading ? (
          <div className="w-full h-20 skeleton rounded-box" />
        ) : isEmptyMEM ? (
          <div className="w-full h-20 flex items-center justify-center">
            <div className="tooltip tooltip-bottom" data-tip={t("No data available")}>
              <CircleHelp className="text-base-content/60" size={18} />
            </div>
          </div>
        ) : (
          <Chart
            value={Math.round(memSeries[memSeries.length - 1] ?? 0)}
            unit={"%"}
            labelA={t("Mem")}
            data={memSeries}
            accent={memAccent}
          />
        )}
      </td>
      <td className="text-center p-2">
        {error ? (
          <div className="w-full h-20 flex items-center justify-center">
            <div className="tooltip tooltip-bottom" data-tip={formatGraphQLError(error)}>
              <CircleAlert className="text-error" size={20} />
            </div>
          </div>
        ) : loading ? (
          <div className="w-full h-20 skeleton rounded-box" />
        ) : isEmptyNET ? (
          <div className="w-full h-20 flex items-center justify-center">
            <div className="tooltip tooltip-bottom" data-tip={t("No data available")}>
              <CircleHelp className="text-base-content/60" size={18} />
            </div>
          </div>
        ) : (
          <Chart
            value={0}
            unit={"bps"}
            data={rxSeries}
            data2={txSeries}
            labelA={t("Down(Net)")}
            labelB={t("Up(Net)")}
            colorA="oklch(var(--p))"
            colorB="oklch(var(--s))"
            accent="text-error-400"
          />
        )}
      </td>
    </>
  );
};

export default ServerStat;
