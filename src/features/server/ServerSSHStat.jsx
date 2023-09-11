import { useState } from "react";
import { useTranslation } from "react-i18next";
import ReactLoading from "react-loading";
import { useWSQuery } from "../../store/baseApi";
import Icon from "../icon";

const ServerSSHStat = ({ data, isLoading, refetch }) => {
  const { t } = useTranslation();

  return (
    <div className="shadown-none">
      <div className="stat place-items-center">
        <div className="stat-title">{t("SSH")}</div>
        <div className="group relative">
          {isLoading || data.length < 1 ? (
            <button
              className="stat-value tooltip cursor-not-allowed"
              data-tip={t("Connecting")}
            >
              <ReactLoading
                type="spinningBubbles"
                className="fill-primary"
                style={{ height: 24, width: 24 }}
              />
            </button>
          ) : data[0].message.success ? (
            <button className="stat-value" onClick={refetch}>
              <Icon icon="CheckCircle" className="text-success" />
            </button>
          ) : data[0].message.error ? (
            <>
              <div className="alert absolute left-1/2 z-50 w-96 max-w-screen-sm -translate-x-1/2 -translate-y-full transform rounded-xl hidden shadow-2xl transition duration-200 group-hover:block">
                <div>
                  <span>{data[0].message.error}</span>
                </div>
              </div>
              <button className="stat-value" onClick={refetch}>
                <Icon icon="WarningCircle" className="text-error" />
              </button>
            </>
          ) : null}
        </div>
      </div>
      {/* ) : (
        <div className="stat place-items-center">
          <div className="stat-title">{t("SSH")}</div>
          <button className="stat-value tooltip" data-tip="hello">
            <Icon icon="WarningCircle" className="text-error" />
          </button>
        </div>
      )} */}
    </div>
  );
};

export default ServerSSHStat;
