import classNames from "classnames";

const ModalShell = ({ title, onClose, maxWidth, children, footer }) => {
  return (
    <div className={classNames("modal-box relative", maxWidth)}>
      <button
        className="btn btn-circle btn-outline btn-sm absolute right-2 top-2"
        onClick={onClose}
        type="button"
      >
        ✕
      </button>
      <h3 className="-mt-3 text-lg font-bold">{title}</h3>
      <div className="mt-4 space-y-4">{children}</div>
      {footer && (
        <div className="mt-4 flex w-full flex-row justify-end space-x-2 px-2">
          {footer}
        </div>
      )}
    </div>
  );
};

export default ModalShell;
