import { useTranslation } from "react-i18next";
import { CircleAlert, CircleHelp } from "lucide-react";
import { Chart } from "./chart/Chart";
import useServerMetrics from "@/hooks/useServerMetrics";
import { formatGraphQLError } from "@/utils/error";

const ServerStat = ({ serverId, sshConnected, metric, as: Cell = "td" }) => {
  const { t } = useTranslation();
  const { cpuSeries, memSeries, rxSeries, txSeries, loading, error } = useServerMetrics(serverId, metric);

  const isEmptyCPU = !loading && !error && cpuSeries.length === 0;
  const isEmptyMEM = !loading && !error && memSeries.length === 0;
  const isEmptyNET = !loading && !error && rxSeries.length === 0 && txSeries.length === 0;
  // Dynamic accent by usage for CPU
  const colorByPct = (pct) => {
    if (pct == null || Number.isNaN(pct)) return "text-mix-[neutral,70,primary,30]";
    if (pct >= 80) return "text-mix-[error,70,primary,30]";
    if (pct >= 35) return "text-mix-[warning,70,primary,30]";
    return "text-mix-[success,70,primary,30]";
  };
  // Distinct palette for Memory so it doesn't match CPU under threshold
  const memColorByPct = (pct) => {
    if (pct == null || Number.isNaN(pct)) return "text-mix-[neutral,70,secondary,30]";
    if (pct >= 85) return "text-mix-[error,70,secondary,30]";
    if (pct >= 65) return "text-mix-[warning,70,secondary,30]";
    return "text-mix-[info,70,secondary,30]";
  };
  const cpuLatest = cpuSeries.length ? cpuSeries[cpuSeries.length - 1] : null;
  const memLatest = memSeries.length ? memSeries[memSeries.length - 1] : null;
  const cpuAccent = colorByPct(cpuLatest);
  const memAccent = memColorByPct(memLatest);
  return (
    <>
      <Cell className="relative z-10 text-center p-2">
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
      </Cell>
      <Cell className="relative z-10 text-center p-2">
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
      </Cell>
      <Cell className="relative z-10 text-center p-2">
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
            colorA="var(--color-primary)"
            colorB="var(--color-secondary)"
            accent="text-error-400"
          />
        )}
      </Cell>
    </>
  );
};

export default ServerStat;
