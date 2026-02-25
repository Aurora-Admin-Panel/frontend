import { useTranslation } from "react-i18next";
import classNames from "classnames";
 
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
    <div className="modal-box relative">
      <h3 className="-mt-3 text-lg font-bold">{title}</h3>
      <div className="mt-4 flex w-full flex-col space-y-0 px-2 text-base">
        <p>{message}</p>
      </div>
      <div className="mt-4 flex w-full flex-row justify-end space-x-2 px-2">
        <button className="btn btn-outline btn-primary" onClick={handleCancel}>
          {cancelText ? t(cancelText) : t("Cancel")}
        </button>
        <button
          className={classNames("btn btn-primary")}
          onClick={handleConfirm}
        >
          {confirmText ? t(confirmText) : t("Confirm")}
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
