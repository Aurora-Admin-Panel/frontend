import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { gql } from '@apollo/client';
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { hideModal } from "../../store/reducers/modal";
import DataLoading from "../DataLoading";
import { useGetPortQuery } from "./PortRestrictionModal.generated";

const _ = gql`
  query GetPort($portId: Int!) {
    port(id: $portId) {
      id
      config
    }
  }
`;

const PortRestrictionModal = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const {
    modalProps: { port },
    onCancel,
    onConfirm,
  } = useSelector((state) => state.modal);
  const { data: portData, isLoading: portLoading } = useGetPortQuery({ portId: port.id });
  const [tab, setTab] = useState(1);

  const handleCancel = () => {
    if (onCancel) onCancel();
    dispatch(hideModal());
  };
  const handleSubmit = async () => {};

  useEffect(() => {}, []);

  return (
    <>
      <label
        className="btn btn-outline btn-circle btn-sm absolute right-2 top-2"
        onClick={() => dispatch(hideModal())}
      >
        ✕
      </label>
      <div className="-mt-3 flex w-full flex-row items-center space-x-2">
        <h3 className="text-lg font-bold">{t("Port Restriction")}</h3>
      </div>
      <div className="mt-4 flex w-full flex-col items-start space-y-0 px-0">
        <div className="tabs tabs-boxed">
          <a className={classNames("tab", { "tab-active": tab === 1 })} onClick={() => setTab(1)}>
            {t("Expiration")}
          </a>
          <a className={classNames("tab", { "tab-active": tab === 2 })} onClick={() => setTab(2)}>
            {t("Speed Limit")}
          </a>
          <a className={classNames("tab", { "tab-active": tab === 3 })} onClick={() => setTab(3)}>
            {t("Traffic Limit")}
          </a>
          <a className={classNames("tab", { "tab-active": tab === 4 })} onClick={() => setTab(4)}>
            {t("Function Limit")}
          </a>
        </div>
        <div className="flex h-64 w-full flex-col items-center justify-center rounded-b-md rounded-tr-md bg-base-200 shadow-xl"></div>
      </div>
      <div className="mt-4 flex w-full flex-row justify-end space-x-2 px-2">
        <label
          className="btn btn-outline btn-ghost btn-sm md:btn-md"
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
      </div>
    </>
  );
};

export default PortRestrictionModal;
