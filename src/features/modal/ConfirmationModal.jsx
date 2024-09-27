import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { useModalReducer } from "../../atoms/modal";

const ConfirmationModal = () => {
  const { t } = useTranslation();
  const {
    modal: {
      modalProps: { title, message, confirmText, cancelText },
      onConfirm, onCancel
    },
    hideModal
  } = useModalReducer();

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    hideModal();
  };
  const handleCancel = () => {
    if (onCancel) onCancel();
    else hideModal();
  };

  return (
    <div className="modal-box relative">
      <h3 className="-mt-3 text-lg font-bold">{title}</h3>
      <div className="mt-4 flex w-full flex-col space-y-0 px-2 text-base">
        <p>{message}</p>
      </div>
      <div className="mt-4 flex w-full flex-row justify-end space-x-2 px-2">
        <button className="btn btn-outline btn-primary" onClick={handleCancel}>
          {t(cancelText) || t("Cancel")}
        </button>
        <button
          className={classNames("btn btn-primary")}
          onClick={handleConfirm}
        >
          {t(confirmText) || t("Confirm")}
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
