import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  User,
  Users,
  Plus,
  ArrowDown,
  ArrowUp,
  CheckCircle,
  Pencil,
  List,
} from "phosphor-react";
import classNames from "classnames";
import gql from "graphql-tag";
import { getReadableSize } from "../../utils/formatter";
import { showModal } from "../../store/reducers/modal";
import DataLoading from "../DataLoading";

const _ = gql`
  mutation DeleteFile($id: Int!) {
    deleteFile(id: $id)
  }
`;

const methodToBadge = (method) => {
  switch (method) {
    case "IMAGE":
      return "badge-secondary";
    case "VIDEO":
      return "badge-accent";
    case "TEXT":
      return "badge-neutral";
    case "EXECUTABLE":
      return "badge-info";
    case "SECRET":
      return "badge-error";
    default:
      return "badge-secondary";
  }
};

const PortCard = ({ port, onUpdate, setSelected }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  return (
    <div className="card relative h-48 w-40 justify-self-center bg-base-100 shadow-xl">
      <div className="card-body px-4 py-4">
        <h2 className="card-title h-6 truncate">
          <span className="toopltip tooltip-bottom" data-tip={port.num}>
            {port.externalNum ? port.externalNum : port.num}
          </span>
          <div
            className="btn-bordered btn btn-ghost btn-xs"
            onClick={() => setSelected({ type: "select", id: port.id, port: port })}
          >
            <List size={16} />
          </div>
          <CheckCircle size={20} className="text-success" />
        </h2>
        <div className="flex grow flex-col items-center justify-start space-y-2">
          <div className="flex w-full flex-row items-start justify-start space-x-2">
            {port.allowedUsers.length > 0 ? (
              <div
                className="badge badge-primary cursor-pointer px-1 text-xs"
                onClick={() => setSelected({ type: "user", id: port.id, port: port })}
              >
                {port.allowedUsers.length === 1 ? (
                  <User size={12} />
                ) : (
                  <Users size={12} />
                )}
                {port.allowedUsers.length}
              </div>
            ) : (
              <div
                className="badge badge-outline cursor-pointer px-1 text-xs"
                onClick={() => setSelected({ type: "user", id: port.id, port: port })}
              >
                <User size={12} />0
              </div>
            )}
            {port.forwardRule ? (
              <div
                className="max-w-16 badge tooltip badge-secondary cursor-pointer justify-start truncate px-1 text-xs"
                data-tip={port.forwardRule.method}
                onClick={() =>
                  dispatch(
                    showModal({
                      modalType: "portFunction",
                      modalProps: { port, serverId: 44 },
                    })
                  )
                }
              >
                {port.forwardRule.method}
              </div>
            ) : (
              <div
                className="badge badge-outline w-8 cursor-pointer px-1 text-xs"
                onClick={() =>
                  dispatch(
                    showModal({
                      modalType: "portFunction",
                      modalProps: { port, serverId: 44},
                    })
                  )
                }
              >
                <Plus size={12} />
              </div>
            )}
          </div>
          {port.config?.valid_until && (
            <div className="flex w-full flex-row items-center justify-start space-x-2">
              <div className="badge badge-warning truncate px-1 text-xs">
                {new Date(port.config.valid_until).toLocaleDateString(
                  i18n.language
                )}
                &nbsp;
                {new Date(port.config.valid_until).toLocaleTimeString(
                  i18n.language
                )}
              </div>
            </div>
          )}
          {port.usage && (
            <div className="flex w-full flex-row items-center justify-center space-x-2">
              <div className="flex flex-row items-center text-xs text-accent-focus">
                <ArrowDown size={12} />
                <span>{getReadableSize(port.usage.download)}</span>
              </div>
              <div className="flex flex-row  items-center text-xs text-accent-focus">
                <ArrowUp size={12} />
                <span>{getReadableSize(port.usage.upload)}</span>
              </div>
            </div>
          )}
          {port.notes && (
            <div className="flex h-20 w-full grow flex-row items-start overflow-hidden text-clip">
              <span className="text-sm text-base-content">{port.notes}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortCard;