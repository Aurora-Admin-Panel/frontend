import classNames from "classnames";
import ServerInfoModal from "../server/ServerInfoModal";
import PortFunctionModal from "../port/PortFunctionModal";
import PortRestrictionModal from "../port/PortRestrictionModal";
import FileModal from "../file/FileModal";
import FilePreviewModal from "../file/FilePreviewModal";
import ConfirmationModal from "./ConfirmationModal";
import DataLoading from "../DataLoading";
import { useModalReducer } from "../../atoms/modal";

const ModalManager = () => {
  const { isOpen, hasBackdrop, modalType, modalProps } = useModalReducer().modal;
  const { hideModal } = useModalReducer();

  const renderModal = () => {
    switch (modalType) {
      case "serverInfo":
        return <ServerInfoModal {...modalProps} />;
      case "port":
        return <PortFunctionModal {...modalProps} />;
      case "file":
        return <FileModal {...modalProps} />;
      case "filePreview":
        return <FilePreviewModal />;
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
      {hasBackdrop && <div className="modal-backdrop" onClick={hideModal} />}
    </div>
  );
};

export default ModalManager;
