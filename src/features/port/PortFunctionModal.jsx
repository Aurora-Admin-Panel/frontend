import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { gql, useQuery } from "@apollo/client";
import classNames from "classnames";
import DataLoading from "../DataLoading";

const GET_RULE_OPTIONS_QUERY = gql`
  query GetRuleOptions($portId: Int!) {
    ruleOptions(portId: $portId)
  }
`;

const PortFunctionModal = ({ modalProps = {}, close, resolve }) => {
  const { t, i18n } = useTranslation();
  const { port, serverId } = modalProps || {};
  const portId = port?.id;
  const { data: ruleOptions, loading: ruleOptionsLoading } = useQuery(
    GET_RULE_OPTIONS_QUERY,
    {
      variables: portId ? { portId } : undefined,
      skip: !portId,
    }
  );

  const [method, setMethod] = useState("iptables");

  const handleCancel = () => {
    if (resolve) resolve(false);
    close();
  };
  const handleSubmit = async () => { };

  useEffect(() => { }, []);
  const availableRuleOptions = ruleOptions?.ruleOptions ?? [];

  return (
    <div className="modal-box relative">
      <label
        className="btn btn-circle btn-outline btn-sm absolute right-2 top-2"
        onClick={close}
      >
        ✕
      </label>
      <div className="-mt-3 flex w-full flex-row items-center space-x-2">
        <h3 className="text-lg font-bold">{t("Port Function")}</h3>
        {!portId ? null : ruleOptionsLoading ? (
          <DataLoading />
        ) : (
          <select
            className="select select-ghost select-xs md:select-md"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            {availableRuleOptions.map((option) => (
              <option value={option} key={option}>
                {t(option)}
              </option>
            ))}
          </select>
        )}
      </div>
      {!portId && (
        <div className="mt-4 px-2 text-sm text-warning">
          {t("No port selected for function configuration.")}
        </div>
      )}
      <div className="mt-4 flex w-full flex-col space-y-0 px-2"></div>
      <div className="mt-4 flex w-full flex-row justify-end space-x-2 px-2">
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
          {serverId ? t("Edit") : t("Add")}
        </button>
      </div>
    </div>
  );
};

export default PortFunctionModal;
