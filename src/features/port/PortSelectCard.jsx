import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Plus, X, Minus } from "phosphor-react";
import classNames from "classnames";
import DataLoading from "../DataLoading";
import { showModal } from "../../store/reducers/modal";

const PortSelectCard = ({ port, setSelected }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <div className="relative flex w-72  flex-col items-center justify-center space-y-2 py-4 px-4">
      <div className="absolute top-2 right-2" onClick={() => setSelected(null)}>
        <div className="btn btn-outline btn-ghost btn-circle btn-xs">
          <X size={20} />
        </div>
      </div>
      <div className="flex w-full flex-row items-center justify-start space-x-2">
        <span className="card-title">
          {port.externalNum ? port.externalNum : port.num}
        </span>
      </div>
      <div className="flex w-full flex-col space-y-4 py-4">
        <button className="btn btn-sm">{t("Edit Port")}</button>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setSelected({ id: port.id, type: "user", port: port })}
        >
          {t("Change Port Users")}
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => {
            setSelected(null);
            dispatch(
              showModal({
                modalType: "portFunction",
                modalProps: {
                  port,
                  serverId: 44,
                },
              })
            );
          }}
        >
          {t("Change Port Function")}
        </button>
        <button
          className="btn btn-accent btn-sm"
          onClick={() => {
            setSelected(null);
            dispatch(
              showModal({
                modalType: "portRestriction",
                modalProps: {
                  port,
                },
              })
            );
          }}
        >
          {t("Restrict Port")}
        </button>
      </div>
    </div>
  );
};

export default PortSelectCard;
