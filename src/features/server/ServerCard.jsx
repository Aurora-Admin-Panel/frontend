import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import ServerPortsStat from "./ServerPortsStat";
import ServerSSHStat from "./ServerSSHStat";
import ServerStat from "./ServerStat";
import ServerTrafficStat from "./ServerTrafficStat";
import useServerItem from "@/hooks/useServerItem";

const ServerCard = ({ server, refetch, metric }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { sshConnected, setSSHConnected, registerSSHRefetch, handleEdit } =
    useServerItem(server, refetch, metric);

  const isDown = sshConnected === false;
  const isConnecting = sshConnected === null;

  return (
    <div
      className={classNames(
        "group flex flex-col rounded-xl border transition-all duration-300 ease-out",
        isDown
          ? "border-error/15 bg-base-200/60"
          : "border-base-content/6 bg-base-100 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-base-content/4"
      )}
    >
      {/* Status accent — communicates health at a glance */}
      <div
        className={classNames(
          "h-[3px] w-full rounded-t-xl transition-colors duration-500",
          isConnecting && "bg-warning/70",
          isDown && "bg-error/40",
          sshConnected === true && "bg-primary/70"
        )}
      />

      {/* Identity zone */}
      <div className="flex items-start gap-3 px-4 pt-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold leading-snug tracking-tight">
            {server.name}
          </h3>
          <p className="mt-0.5 truncate font-mono text-[10px] tracking-wide opacity-20">
            {server.address}
          </p>
        </div>
        <div className="flex-shrink-0">
          <ServerSSHStat
            server={server}
            sshConnected={sshConnected}
            setSSHConnected={setSSHConnected}
            registerSSHRefetch={registerSSHRefetch}
          />
        </div>
      </div>

      {/* Metrics strip */}
      <div className="flex items-center gap-3 px-4 py-2">
        <ServerPortsStat
          usedPorts={server.portUsed}
          totalPorts={server.portTotal}
          sshConnected={sshConnected}
        />
        <div className="h-3 w-px bg-base-content/8" />
        <ServerTrafficStat
          uploadTotal={server.uploadTotal}
          downloadTotal={server.downloadTotal}
          sshConnected={sshConnected}
        />
      </div>

      {/* Sparkline charts — horizontal, the visual anchor */}
      <div className="flex flex-row border-t border-base-content/[0.04] [&>div]:flex-1">
        <ServerStat
          serverId={server.id}
          sshConnected={sshConnected}
          metric={metric}
          as="div"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 border-t border-base-content/[0.04] px-3 py-2">
        <button
          className="btn btn-ghost btn-sm flex-1 text-xs"
          onClick={handleEdit}
        >
          {t("Edit")}
        </button>
        <button
          className="btn btn-primary btn-sm flex-1 text-xs"
          onClick={() => navigate(`/app/servers/${server.id}`)}
        >
          {t("Check")}
        </button>
      </div>
    </div>
  );
};

export default React.memo(ServerCard);
