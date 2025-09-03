import React from "react";
import Sparkline from "./Sparkline";

const formatPct = (n) => `${Math.round(n)}%`;
const formatBps = (n) => {
  if (n > 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} GB/s`;
  if (n > 1_000_000) return `${(n / 1_000_000).toFixed(1)} MB/s`;
  if (n > 1_000) return `${(n / 1_000).toFixed(1)} KB/s`;
  return `${Math.round(n)} B/s`;
};

export const Chart = ({
  unit,
  data,
  data2 = null, // optional second series (e.g., up/down)
  accent = "text-emerald-500",
  className = "",
  area = true,
  labelA = "Up",
  labelB = "Down",
  colorA = "currentColor",
  colorB = "hsl(var(--su))",
  formatValue: fmtOverride,
}) => {
  const fmt = fmtOverride || (unit === "%" ? formatPct : formatBps);
  return (
    <div className={`w-full h-full bg-base-100/80 backdrop-blur supports-[backdrop-filter]:bg-base-100/60 ${className}`}>
      <div className="w-full h-20">
        <Sparkline
          data={data}
          data2={data2}
          className={`w-full h-full ${accent}`}
          formatValue={fmt}
          unit={unit}
          area={area}
          labelA={labelA}
          labelB={labelB}
          colorA={colorA}
          colorB={colorB}
        />
      </div>
    </div>
  );
};
