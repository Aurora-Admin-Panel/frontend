import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { hideModal } from "../../store/reducers/modal";

const ConfirmationModal = ({ ...props }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { onCancel, onConfirm } = useSelector((state) => state.modal);
  const { title, message, confirmText, cancelText } = props;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    dispatch(hideModal());
  };
  const handleCancel = () => {
    if (onCancel) onCancel();
    dispatch(hideModal());
  };

  return (
    <div className="modal-box relative">
      <h3 className="-mt-3 text-lg font-bold">{title}</h3>
      <div className="mt-4 flex w-full flex-col space-y-0 px-2">
        <p>{message}</p>
      </div>
      <div className="mt-4 flex w-full flex-row justify-end space-x-2 px-2">
        <button className="btn btn-outline btn-primary" onClick={handleCancel}>
          {cancelText || t("Cancel")}
        </button>
        <button
          className={classNames("btn btn-primary")}
          onClick={handleConfirm}
        >
          {confirmText || t("Confirm")}
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
