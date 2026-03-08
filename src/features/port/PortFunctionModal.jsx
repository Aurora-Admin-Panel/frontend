import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { gql, useQuery } from "@apollo/client";
import classNames from "classnames";
import DataLoading from "../DataLoading";
import ModalShell from "../ui/ModalShell";

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
    <ModalShell
      title={
        <div className="flex flex-row items-center space-x-2">
          <span>{t("Port Function")}</span>
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
      }
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
            {serverId ? t("Edit") : t("Add")}
          </button>
        </>
      }
    >
      {!portId && (
        <div className="px-2 text-sm text-warning">
          {t("No port selected for function configuration.")}
        </div>
      )}
    </ModalShell>
  );
};

export default PortFunctionModal;
