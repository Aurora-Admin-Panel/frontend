import classNames from "classnames";
import ServerInfoModal from "../server/ServerInfoModal";
import PortFunctionModal from "../port/PortFunctionModal";
import PortRestrictionModal from "../port/PortRestrictionModal";
import FileModal from "../file/FileModal";
import ConfirmationModal from "./ConfirmationModal";
import DataLoading from "../DataLoading";
import { useModalReducer } from "../../atoms/modal";

const ModalManager = () => {
  const { isOpen, modalType, modalProps } = useModalReducer().modal;

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
        return <ConfirmationModal />;
      case "loading":
        return <DataLoading />;
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
      {renderModal()}
    </div>
  );
};

export default ModalManager;
