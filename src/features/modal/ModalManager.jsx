import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import ServerInfoModal from "../server/ServerInfoModal";
import PortFunctionModal from "../port/PortFunctionModal";
import PortRestrictionModal from "../port/PortRestrictionModal";
import FileModal from "../file/FileModal";
import ConfirmationModal from "./ConfirmationModal";

const ModalManager = () => {
  const dispatch = useDispatch();
  const { isOpen, modalType, modalProps } = useSelector((state) => state.modal);

  const renderModal = () => {
    switch (modalType) {
      case "serverInfo":
        return <ServerInfoModal {...modalProps} />;
      case "file":
        return <FileModal {...modalProps} />;
      case "portFunction":
        return <PortFunctionModal {...modalProps} />;
      case "portRestriction":
        return <PortRestrictionModal {...modalProps} />;
      case "confirmation":
        return <ConfirmationModal {...modalProps} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={classNames("modal modal-bottom sm:modal-middle", {
        "modal-open": isOpen,
      })}
    >
      <div className="modal-box relative">{renderModal()}</div>
    </div>
  );
};

export default ModalManager;
