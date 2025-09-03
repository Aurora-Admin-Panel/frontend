import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import { gql, useSubscription } from "@apollo/client";

import { Pencil } from "lucide-react";
import ServerPortsStat from "./ServerPortsStat";
import ServerSSHStat from "./ServerSSHStat";
import ServerStat from "./ServerStat";
import ServerTrafficStat from "./ServerTrafficStat";
import { useModalReducer } from "../../atoms/modal";

const ServerCard = ({ server, refetch }) => {
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
    <div
      className={classNames(
        "mx-auto flex w-72 flex-col items-center justify-between space-y-4 rounded-2xl border px-4 py-4 shadow-xl sm:w-80",
        sshConnected === false ? "bg-base-200 border-base-300" : "bg-base-100 border-base-200"
      )}
      onMouseEnter={(_) => setShow(true)}
      onMouseLeave={(_) => setShow(false)}
    >
      {/* Server body */}
      <div className="flex grow flex-col items-center space-y-2">
        {/* Server name */}
        <div className="ml-[24px] flex w-auto max-w-xs flex-row">
          <h1 className="break-word card-title text-xl">{server.name}</h1>
          <button
            className={classNames("text-primary", show ? "block" : "invisible")}
            onClick={handleEdit}
          >
            <Pencil size={24} />
          </button>
        </div>
        {/* Server name */}
        {/* Server stat */}
        <div className="flex grow flex-col items-center">
          <div className="flex flex-row items-center justify-center">
            <ServerSSHStat
              serverId={server.id}
              sshConnected={sshConnected}
              setSSHConnected={setSSHConnected}
              registerSSHRefetch={registerSSHRefetch}
            />
            <ServerPortsStat
              usedPorts={server.portUsed}
              totalPorts={server.portTotal}
              sshConnected={sshConnected}
            />
          </div>
          <div className="flex grow flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center xs:flex-row">
              <ServerTrafficStat
                uploadTotal={server.uploadTotal}
                downloadTotal={server.downloadTotal}
                sshConnected={sshConnected}
              />
            </div>
          </div>
          <div className="flex grow flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center  ">
              <ServerStat serverId={server.id} sshConnected={sshConnected} />
            </div>
          </div>
        </div>
        {/* Server stat */}
      </div>
      {/* Server body */}
      {/* Server actions */}
      <div className="flex flex-row justify-center space-x-4">
        <button
          className="btn btn-secondary btn-outline btn-sm justify-self-end xl:btn-md"
          onClick={handleEdit}
        >
          {t("Edit")}
        </button>
        <button
          className="btn btn-primary btn-sm  justify-self-end xl:btn-md"
          onClick={() => navigate(`/app/servers/${server.id}/ports`)}
        >
          {t("Check")}
        </button>
      </div>
      {/* Server actions */}
    </div>
  );
};

export default ServerCard;
