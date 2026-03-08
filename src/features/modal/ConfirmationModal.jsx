import { useTranslation } from "react-i18next";
import ModalShell from "../ui/ModalShell";

const ConfirmationModal = ({ modalProps = {}, close, resolve }) => {
  const { t } = useTranslation();
  const { title, message, confirmText, cancelText } = modalProps;

  const handleConfirm = () => {
    if (resolve) resolve(true);
    close();
  };
  const handleCancel = () => {
    if (resolve) resolve(false);
    close();
  };

  return (
    <ModalShell
      title={title}
      onClose={handleCancel}
      footer={
        <>
          <button className="btn btn-outline btn-primary" onClick={handleCancel}>
            {cancelText ? t(cancelText) : t("Cancel")}
          </button>
          <button className="btn btn-primary" onClick={handleConfirm}>
            {confirmText ? t(confirmText) : t("Confirm")}
          </button>
        </>
      }
    >
      <p className="px-2 text-base">{message}</p>
    </ModalShell>
  );
};

export default ConfirmationModal;
