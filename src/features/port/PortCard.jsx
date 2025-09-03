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
} from "lucide-react";
import classNames from "classnames";
import { getReadableSize } from "../../utils/formatter";
import { useModalReducer } from "../../atoms/modal";


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
  const { showModal } = useModalReducer();

  return (
    <div className="card relative h-44 w-40 justify-self-center bg-base-200 border-primary border-1 shadow-xl rounded-box">
      <div className="card-body px-4 py-4">
        <h2 className="card-title h-6 truncate">
          <span className="toopltip tooltip-bottom" data-tip={port.num}>
            {port.externalNum ? port.externalNum : port.num}
          </span>
          <div
            className="btn-bordered btn btn-ghost btn-xs"
            onClick={() =>
              setSelected({ type: "select", id: port.id, port: port })
            }
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
                onClick={() =>
                  setSelected({ type: "user", id: port.id, port: port })
                }
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
                onClick={() =>
                  setSelected({ type: "user", id: port.id, port: port })
                }
              >
                <User size={12} />0
              </div>
            )}
            {port.forwardRule ? (
              <div
                className="flex flex-row max-w-16 badge badge-secondary tooltip cursor-pointer items-center justify-center truncate px-1 text-xs"
                data-tip={port.forwardRule.method}
                onClick={() =>
                    showModal({
                      modalType: "portFunction",
                      modalProps: { port, serverId: 44 },
                  })
                }
              >
                {port.forwardRule.method}
              </div>
            ) : (
              <div
                className="badge badge-outline w-8 cursor-pointer px-1 text-xs"
                onClick={() =>
                    showModal({
                      modalType: "portFunction",
                      modalProps: { port, serverId: 44 },
                    })
                  
                }
              >
                <Plus size={12} />
              </div>
            )}
          </div>
          <div className="flex w-full flex-col items-start justify-center space-y-1">
            <div
              className={classNames(
                "flex flex-row  items-center text-sm font-bold",
                port.usage ? "text-accent-focus" : "text-accent-focus/50"
              )}
            >
              <ArrowUp size={16} weight="bold" />
              <span>{getReadableSize(port.usage ? port.usage.upload : 0)}</span>
            </div>
            <div
              className={classNames(
                "flex flex-row items-center text-sm font-bold",
                port.usage ? "text-accent-focus" : "text-accent-focus/50"
              )}
            >
              <ArrowDown size={16} weight="bold" />
              <span>
                {getReadableSize(port.usage ? port.usage.download : 0)}
              </span>
            </div>
          </div>
          {port.notes && (
            <div
              className="tooltip  flex w-full flex-row items-start justify-start"
              data-tip={port.notes}
            >
              <div className="flex h-4 w-full flex-row items-start overflow-hidden">
                <span className="text-clip text-sm text-base-content">
                  {port.notes}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      {port.config?.valid_until && (
        <div className="rounded-b-box flex w-full flex-row items-center justify-center bg-warning/50 px-4">
          <div className="truncate py-1 text-xs font-bold text-warning-content">
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
    </div>
  );
};

export default PortCard;
