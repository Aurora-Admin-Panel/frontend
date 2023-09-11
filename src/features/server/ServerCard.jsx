import classNames from "classnames";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Icon from "../icon";
import ServerPortsStat from "./ServerPortsStat";
import ServerSSHStat from "./ServerSSHStat";
import ServerStat from "./ServerStat";
import ServerTrafficStat from "./ServerTrafficStat";
import { getReadableSize } from "../../utils/formatter";
import { useWSQuery } from "../../store/baseApi";
import { showModal } from "../../store/reducers/modal";

const ServerCard = ({ server, refetch }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [show, setShow] = useState(false);
  const {
    data: sshData,
    isLoading: sshLoading,
    refetch: sshRefetch,
  } = useWSQuery({
    type: "tasks",
    name: "connect_runner2",
    server_id: server.id,
  });

  const handleClick = () => {
    dispatch(
      showModal({
        modalType: "serverInfo",
        modalProps: {
          serverId: server.id,
        },
        onConfirm: () => {
          refetch();
          sshRefetch();
        },
      })
    );
  };
  return (
    <div
      className="flex w-full flex-col items-center justify-between space-y-4 rounded-2xl border border-base-200 bg-base-100 px-1 py-2 shadow-xl sm:px-2 md:flex-row md:space-y-0 md:px-6 md:py-4 lg:px-10"
      onMouseEnter={(_) => setShow(true)}
      onMouseLeave={(_) => setShow(false)}
    >
      {/* Server body */}
      <div className="flex grow flex-col items-center space-y-4 md:space-y-0 lg:flex-row lg:space-x-4">
        {/* Server name */}
        <div className="flex w-auto max-w-xs flex-row space-x-1 lg:w-32 xl:w-36 2xl:w-64">
          <h1 className="break-word card-title text-lg">{server.name}</h1>
          <button
            className={classNames("text-primary", show ? "block" : "invisible")}
            onClick={handleClick}
          >
            <Icon icon="Pencil" size={24} />
          </button>
        </div>
        {/* Server name */}
        {/* Server stat */}
        <div className="flex grow flex-col items-center lg:flex-row">
          <ServerSSHStat
            data={sshData}
            isLoading={sshLoading}
            refetch={sshRefetch}
          />
          <div className="flex grow flex-col items-center justify-center xl:flex-row xl:justify-start">
            <div className="flex w-96 flex-col items-center justify-center xs:flex-row">
              <ServerPortsStat
                usedPorts={server.portUsed}
                totalPorts={server.portTotal}
              />
              <ServerTrafficStat
                upstreamTraffic={getReadableSize(server.uploadTotal)}
                downstreamTraffic={getReadableSize(server.downloadTotal)}
              />
            </div>
            {server.stat ? (
              <ServerStat cpuStat="20%" memStat="50%" diskStat="80%" />
            ) : (
              <div className="flex-grow-1 w-48" />
            )}
          </div>
        </div>
        {/* Server stat */}
      </div>
      {/* Server body */}
      {/* Server actions */}
      <div className="flex justify-center md:space-x-2">
        <button className="btn btn-primary justify-self-end" onClick={() => navigate(`/app/servers/${server.id}/ports`)}>
          {t("Check")}
        </button>
      </div>
      {/* Server actions */}
    </div>
  );
};

export default ServerCard;
