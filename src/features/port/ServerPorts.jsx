import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import gql from "graphql-tag";
import Icon from "../Icon";
import Error from "../layout/Error";
import { motion, AnimatePresence } from "framer-motion";
import useQueryParams from "../../hooks/useQueryParams";
import useWindowSize from "../../hooks/useWindowSize";
import { useGetServerPortsQuery } from "./ServerPorts.generated";
import Paginator from "../Paginator";
import PortCard from "./PortCard";
import DataLoading from "../DataLoading";
import PortUsersCard from "./PortUsersCard";
import PortSelectCard from "./PortSelectCard";

const _ = gql`
  query GetServerPorts(
    $serverId: Int!
    $limit: Int
    $offset: Int
    $orderBy: String
  ) {
    paginatedPorts(
      serverId: $serverId
      limit: $limit
      offset: $offset
      orderBy: $orderBy
    ) {
      items {
        id
        num
        externalNum
        notes
        config
        allowedUsers {
          user {
            id
            email
          }
        }
        users {
          id
          email
        }
        forwardRule {
          id
          method
          status
        }
        usage {
          download
          upload
        }
      }
      count
    }
  }
`;

const SelectCard = ({ selected, setSelected }) => {
  const { innerWidth } = useWindowSize();
  const getCard = () => {
    switch (selected.type) {
      case "user":
        return <PortUsersCard port={selected.port} setSelected={setSelected} />;
      case "select":
        return (
          <PortSelectCard port={selected.port} setSelected={setSelected} />
        );
      default:
        return <PortUsersCard port={selected.port} setSelected={setSelected} />;
    }
  };
  return (
    <motion.div
      className={classNames(
        "fixed z-40 mx-auto w-auto max-w-screen-sm rounded-lg bg-base-200 shadow-xl",
        {
          "top-1/4": !!!selected.position || selected.position === "middle",
          "bottom-0": selected.position === "bottom",
        }
      )}
      layoutId={selected.id}
    >
      {getCard()}
    </motion.div>
  );
};

const ServerPorts = () => {
  const { serverId } = useParams();
  const { t } = useTranslation();
  const [limit, offset, setLimit, setOffset] = useQueryParams([
    {
      name: "limit",
      defaultValue: 24,
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
  const { data, isLoading, error, refetch } = useGetServerPortsQuery({
    serverId: Number(serverId),
    limit,
    offset,
  });
  const [selected, setSelected] = useState(null);

  if (error) return <Error error={error} />;
  return (
    <>
      <AnimatePresence>
        {selected && (
          <SelectCard
            selected={selected}
            setSelected={(payload) =>
              setSelected(
                payload
                  ? {
                      ...payload,
                      id: selected.id,
                      port: data?.paginatedPorts?.items.find(
                        (port) => port.id === selected.id
                      ),
                    }
                  : null
              )
            }
          />
        )}
      </AnimatePresence>
      <div className="flex-grow-1 container flex h-16 w-full flex-shrink-0 basis-16 flex-row items-center justify-between px-4 sm:px-8">
        <div className="flex flex-row items-center justify-start">
          <h1 className="text-2xl font-extrabold">{t("Ports")}</h1>
          <label
            className="modal-button btn btn-primary btn-circle btn-xs ml-2"
            onClick={() =>
              dispatch(
                showModal({
                  modalType: "port",
                  onConfirm: refetch,
                })
              )
            }
          >
            <Icon icon="Plus" />
          </label>
        </div>
      </div>

      <div className="relative flex max-h-screen w-full flex-col overflow-y-auto">
        {isLoading ? (
          <DataLoading />
        ) : (
          <>
            <div className="grid w-full grid-cols-2 gap-4 px-2 pt-2 pb-4  sm:grid-cols-3 md:grid-cols-4  lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
              {(data?.paginatedPorts?.items ?? []).map((port) => (
                <motion.div key={port.id} layoutId={port.id}>
                  <PortCard
                    key={port.id}
                    port={port}
                    onUpdate={refetch}
                    setSelected={setSelected}
                  />
                </motion.div>
              ))}
            </div>
          </>
        )}
        <Paginator
          isLoading={isLoading}
          count={data?.paginatedPorts?.count}
          limit={limit}
          offset={offset}
          setLimit={setLimit}
          setOffset={setOffset}
          limitOptions={[12, 24, 48, 96]}
        />
      </div>
    </>
  );
};

export default ServerPorts;
