import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { gql, useQuery } from "@apollo/client";
import classNames from "classnames";
import { useSelector } from "react-redux";
import ModalShell from "../ui/ModalShell";

const GET_PORT_QUERY = gql`
  query GetPort($portId: Int!) {
    port(id: $portId) {
      id
      config
    }
  }
`;

const PortRestrictionModal = ({ modalProps = {}, close, resolve }) => {
  const { t, i18n } = useTranslation();
  const { port } = modalProps;
  const portId = port?.id;
  const { data: portData, isLoading: portLoading } = useQuery(GET_PORT_QUERY, {
    variables: portId ? { portId } : undefined,
    skip: !portId,
  });
  const [tab, setTab] = useState(1);

  const handleCancel = () => {
    if (resolve) resolve(false);
    close();
  };
  const handleSubmit = async () => { };

  useEffect(() => { }, []);

  return (
    <ModalShell
      title={t("Port Restriction")}
      onClose={close}
      footer={
        <>
          <label
            className="btn btn-ghost btn-outline btn-sm md:btn-md"
            onClick={handleCancel}
          >
            {t("Cancel")}
          </label>
          <button
            className={classNames("btn btn-primary btn-sm md:btn-md", {
              loading: false,
            })}
            onClick={handleSubmit}
          >
            {t("Save")}
          </button>
        </>
      }
    >
      <div className="flex w-full flex-col items-start space-y-0">
        <div className="tabs-boxed tabs">
          <a
            className={classNames("tab", { "tab-active": tab === 1 })}
            onClick={() => setTab(1)}
          >
            {t("Expiration")}
          </a>
          <a
            className={classNames("tab", { "tab-active": tab === 2 })}
            onClick={() => setTab(2)}
          >
            {t("Speed Limit")}
          </a>
          <a
            className={classNames("tab", { "tab-active": tab === 3 })}
            onClick={() => setTab(3)}
          >
            {t("Traffic Limit")}
          </a>
          <a
            className={classNames("tab", { "tab-active": tab === 4 })}
            onClick={() => setTab(4)}
          >
            {t("Function Limit")}
          </a>
        </div>
        <div className="flex h-64 w-full flex-col items-center justify-center rounded-b-md rounded-tr-md bg-base-200 shadow-xl"></div>
      </div>
    </ModalShell>
  );
};

export default PortRestrictionModal;
