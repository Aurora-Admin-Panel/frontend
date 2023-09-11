import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import ServerCard from "./ServerCard";
import Icon from "../icon";
import { gql } from "graphql-tag";
import { useLocation } from "react-router-dom";
import { useGetServersQuery } from "./ServerList.generated";
import { useWSQuery } from "../../store/baseApi";
import { showModal } from "../../store/reducers/modal";
import Error from "../layout/Error";
import DataLoading from "../DataLoading";
import Paginator from "../Paginator";
import useQueryParams from "../../hooks/useQueryParams";
import { useUserMeApiV1UsersMeGetQuery } from "../../store/apis/apis";
import { showNotification } from "../../store/reducers/notification";

const _ = gql`
  query GetServers($limit: Int, $offset: Int) {
    paginatedServers(limit: $limit, offset: $offset) {
      items {
        id
        name
        portUsed
        portTotal
        downloadTotal
        uploadTotal
      }
      count
    }
  }
`;

const ServerList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
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
  const { data, isLoading, isFetching, error, refetch } = useGetServersQuery({
    limit,
    offset,
  });

  if (error) return <Error error={error} />;
  return (
    <>
      <div className="flex-grow-1 container flex h-16 w-full flex-shrink-0 basis-16 flex-row items-center justify-between px-4 sm:px-8">
        <div className="flex flex-row items-center justify-start">
          <h1 className="text-2xl font-extrabold">{t("Servers")}</h1>
          <label
            className="modal-button btn btn-circle btn-primary btn-xs ml-2"
            onClick={() => dispatch(showModal({ modalType: "serverInfo", onConfirm: refetch }))}
          >
            <Icon icon="Plus" />
          </label>
        </div>
      </div>

      <div className="flex max-h-screen w-full flex-auto flex-col items-center space-y-3 overflow-y-auto px-2 pt-2 pb-4">
        {(data?.paginatedServers?.items ?? []).map((server) => (
          <ServerCard key={server.id} server={server} refetch={refetch} />
        ))}
        <Paginator
          isLoading={isLoading || isFetching}
          count={data?.paginatedServers?.count}
          limit={limit}
          offset={offset}
          setLimit={setLimit}
          setOffset={setOffset}
        ></Paginator>
      </div>
    </>
  );
};

export default ServerList;