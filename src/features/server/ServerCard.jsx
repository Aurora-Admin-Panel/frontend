import classNames from "classnames";
import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { gql, useSubscription } from "@apollo/client";
import Icon from "../Icon";
import ServerPortsStat from "./ServerPortsStat";
import ServerSSHStat from "./ServerSSHStat";
import ServerStat from "./ServerStat";
import ServerTrafficStat from "./ServerTrafficStat";
import { getReadableSize } from "../../utils/formatter";
import { useWSQuery } from "../../store/baseApi";
import { showModal } from "../../store/reducers/modal";
import { use } from "i18next";

const ServerCard = ({ server, refetch }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [show, setShow] = useState(false);

  const handleClick = () => {
    dispatch(
      showModal({
        modalType: "serverInfo",
        modalProps: {
          serverId: server.id,
        },
        onConfirm: () => {
          refetch();
        },
      })
    );
  };
  return (
    <div
      className="mx-auto flex w-72 flex-col items-center justify-between space-y-4 rounded-2xl border border-base-200 bg-base-100 px-4 py-4 shadow-xl sm:w-80"
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
            onClick={handleClick}
          >
            <Icon icon="Pencil" size={24} />
          </button>
        </div>
        {/* Server name */}
        {/* Server stat */}
        <div className="flex grow flex-col items-center">
          <div className="flex flex-row items-center justify-center">
            <ServerSSHStat
              serverId={server.id}
            />
            <ServerPortsStat
              usedPorts={server.portUsed}
              totalPorts={server.portTotal}
            />
          </div>
          <div className="flex grow flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center xs:flex-row">
              <ServerTrafficStat
                upstreamTraffic={getReadableSize(server.uploadTotal)}
                downstreamTraffic={getReadableSize(server.downloadTotal)}
              />
            </div>
          </div>
          <div className="flex grow flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center  ">
              <ServerStat serverId={server.id} />
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
          onClick={() => navigate(`/app/servers/${server.id}/ports`)}
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
