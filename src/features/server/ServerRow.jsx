import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import { gql, useSubscription } from "@apollo/client";

import Icon from "../Icon";
import ServerPortsStat from "./ServerPortsStat";
import ServerSSHStat from "./ServerSSHStat";
import ServerStat from "./ServerStat";
import ServerTrafficStat from "./ServerTrafficStat";
import { useModalReducer } from "../../atoms/modal";

const Stat = ({ title, color, value, loading, completed }) => {
    const { t } = useTranslation();
    const [scope, animate] = useAnimate();
  
    useEffect(() => {
      if (scope.current) {
        animate(scope.current, { opacity: [0, 1, 0.6] }, { duration: 5 });
      }
    }, [value]);
  
    return (
      <div className="stat place-items-center">
        <div className="stat-title">{t(title)}</div>
        {completed || value === null || value === undefined ? (
          <Icon icon="Prohibit" className="text-netural opacity-60" />
        ) : loading ? (
          <div className="stat-value">
            <ReactLoading
              type="spinningBubbles"
              className={`fill-${color}`}
              style={{ height: 16, width: 16 }}
            />
          </div>
        ) : (
          <div className={`stat-desc text-${color}`} ref={scope}>
            {value}%
          </div>
        )}
      </div>
    );
  };

const ServerRow = ({ server, refetch }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { showModal } = useModalReducer();
    const [show, setShow] = useState(false);
    const [sshRefetch, setSSHRefetch] = useState(null);
    const [sshConnected, setSSHConnected] = useState(false);
    

    const registerSSHRefetch = useCallback((func) => {
        setSSHRefetch(func);
    }, []);

    const handleEdit = () => {
        showModal({
            modalType: "serverInfo",
            modalProps: {
                serverId: server.id,
                refetch: refetch,
            },
            onConfirm: () => {
                refetch();
                if (sshRefetch) sshRefetch();
            },
        })
    };

    return (
        <tr className="md:rounded-box shadow-md border border-base-200 h-16 w-full">
            <th className="text-center p-4 sticky top-0 bg-base-100 left-0 z-10 bg-base-100">
                <h1 className="break-word text-md text-center sm:text-md">{server.name}</h1>
            </th>
            <td className="text-center p-2">
                <ServerSSHStat
                    serverId={server.id}
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
                <span className="badge badge-sm badge-outline text-wrap text-xs hover:cursor-pointer" onClick={() => navigator.clipboard.writeText(server.address)}>{server.address}</span>
            </td>
            <ServerStat
                serverId={server.id}
                sshConnected={sshConnected}
            />
            <td className="flex flex-col justify-center items-center space-y-2 text-center p-2 sticky right-0 z-10 bg-base-100">
                    <button
                        className="btn btn-secondary btn-outline btn-xs"
                        onClick={handleEdit}
                    >
                        {t("Edit")}
                    </button>
                    <button
                        className="btn btn-primary btn-xs"
                        onClick={() => navigate(`/app/servers/${server.id}/ports`)}
                    >
                        {t("Check")}
                    </button>
            </td>
        </tr>
    );
};

export default ServerRow;