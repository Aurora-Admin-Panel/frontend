import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ServerCard from "./ServerCard";
import Icon from "../Icon";
import { gql, useQuery } from "@apollo/client";
import { GET_SERVERS_QUERY } from "../../quries/server";
import Error from "../layout/Error";
import Paginator from "../Paginator";
import useQueryParams from "../../hooks/useQueryParams";
import { useModalReducer } from "../../atoms/modal";

const ServerList = () => {
  const { t } = useTranslation();
  const { showModal } = useModalReducer();
  const [limit, offset, setLimit, setOffset] = useQueryParams([
    {
      name: "limit",
      defaultValue: 10,
      isNumeric: true,
      replace: false,
    },
    {
      name: "offset",
      defaultValue: 0,
      isNumeric: true,
      replace: false,
    },
  ]);
  const { data, loading, error, refetch } = useQuery(
    GET_SERVERS_QUERY,
    { variables: { limit, offset } }
  );
  const [listStyle, setListStyle] = useState("Cards view");

  if (error) return <Error error={error} />;
  return (
    <>
      <div className="flex-grow-1 container flex h-16 w-full flex-shrink-0 basis-16 flex-row items-center justify-between px-4 sm:px-8">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex flex-row items-center justify-start">
            <h1 className="text-2xl font-extrabold">{t("Servers")}</h1>
            <label
              className="modal-button btn btn-circle btn-primary btn-xs ml-2"
              onClick={() => showModal({ modalType: "serverInfo", onConfirm: refetch })}
            >
              <Icon icon="Plus" />
            </label>
          </div>
          <div className="flex flex-row items-center justify-end space-x-2">
            <div className="tooltip tooltip-bottom" data-tip={t(listStyle)}>
              <label className="swap swap-flip text-9xl">
                {/* this hidden checkbox controls the state */}
                <input
                  type="checkbox"
                  value={listStyle === "Cards view"}
                  onClick={() => setListStyle(listStyle === "Cards view" ? "List view" : "Cards view")}
                />

                <div className="swap-on"><Icon icon="ListDashes" size={20} /></div>
                <div className="swap-off"><Icon icon="Cards" size={20} /></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {listStyle === "Cards view" ? (
        <>
          <div className="grid grid-cols-1 gap-6 px-2 pb-4 pt-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {(data?.paginatedServers?.items ?? []).map((server) => (
              <ServerCard key={server.id} server={server} refetch={refetch} />
            ))}
          </div>
          <Paginator
            isLoading={loading}
            count={data?.paginatedServers?.count}
            limit={limit}
            offset={offset}
            setLimit={setLimit}
            setOffset={setOffset}
          ></Paginator>
        </>
      ) : (
        <span>list</span>
      )}
    </>
  );
};

export default ServerList;
