import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";

import { useNotificationsReducer } from "../../atoms/notification";
import { copyToClipboard } from "../../utils/clipboard";
import ServerPortsStat from "./ServerPortsStat";
import ServerSSHStat from "./ServerSSHStat";
import ServerStat from "./ServerStat";
import ServerTrafficStat from "./ServerTrafficStat";
import useServerItem from "@/hooks/useServerItem";


const ServerRow = ({ server, refetch, metric }) => {
  const { addNotification } = useNotificationsReducer()
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { sshConnected, setSSHConnected, registerSSHRefetch, handleEdit } = useServerItem(server, refetch);

  const handleCopy = (address) => {
    copyToClipboard(address);
    addNotification({
      title: address,
      body: t("Server address copied to clipboard"),
      type: "success",
    });
  }

  return (
    <tr className="h-20 w-full shadow-lg rounded-box ring-1 ring-base-300">
      <td className="rounded-l-box text-center p-4 sticky top-0 left-0 z-10 bg-base-100">
        <h1 className="break-word text-md text-center sm:text-md">{server.name}</h1>
      </td>
      <td className="text-center p-2">
        <ServerSSHStat
          server={server}
          sshConnected={sshConnected}
          setSSHConnected={setSSHConnected}
          registerSSHRefetch={registerSSHRefetch}
        />
      </td>
      <td className="text-center p-2">
        <ServerPortsStat
          usedPorts={server.portUsed}
          totalPorts={server.portTotal}
          sshConnected={sshConnected}
        />
      </td>
      <td className="text-center p-2">
        <ServerTrafficStat
          uploadTotal={server.uploadTotal}
          downloadTotal={server.downloadTotal}
          sshConnected={sshConnected}
        />
      </td>
      <td className="text-center p-2">
          <span
            className="badge badge-sm badge-outline text-wrap text-xs hover:cursor-pointer transition-transform transform hover:scale-105 active:scale-95"
            onClick={() => handleCopy(server.address)}
          >
            {server.address}
          </span>
      </td>
      <ServerStat
        serverId={server.id}
        sshConnected={sshConnected}
        metric={metric}
      />
      <td className="sticky right-0 z-10 rounded-r-box bg-base-100">
        <div className="flex flex-col justify-center items-center space-y-2">
          <button
            className="btn btn-secondary btn-outline btn-xs text-xs w-12"
            onClick={handleEdit}
          >
            {t("Edit")}
          </button>
          <button
            className="btn btn-primary btn-xs w-12 text-xs"
            onClick={() => navigate(`/app/servers/${server.id}/ports`)}
          >
            {t("Check")}
          </button>

        </div>
      </td>
    </tr>
  );
};

export default React.memo(ServerRow);
