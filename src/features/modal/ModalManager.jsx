import { useEffect } from "react";
import classNames from "classnames";
import ServerInfoModal from "../server/ServerInfoModal";
import PortFunctionModal from "../port/PortFunctionModal";
import PortRestrictionModal from "../port/PortRestrictionModal";
import FileModal from "../file/FileModal";
import FilePreviewModal from "../file/FilePreviewModal";
import ConfirmationModal from "./ConfirmationModal";
import DataLoading from "../DataLoading";
import { useModal } from "../../atoms/modal";

const validateOk = () => ({ ok: true });

const requireField = (path) => (props) => {
  let value = props;
  for (const key of path) {
    value = value?.[key];
  }
  if (value === undefined || value === null) {
    return { ok: false, reason: `Missing modalProps.${path.join(".")}` };
  }
  return { ok: true };
};

const confirmationValidator = (props) => {
  if (!props || props.title == null || props.message == null) {
    return { ok: false, reason: "confirmation requires title and message" };
  }
  return { ok: true };
};

const LoadingModalContent = () => (
  <div className="modal-box">
    <DataLoading />
  </div>
);

const InvalidModalContent = ({ modalType, reason, close }) => (
  <div className="modal-box relative">
    <button
      className="btn btn-circle btn-outline btn-sm absolute right-2 top-2"
      onClick={close}
      type="button"
    >
      ✕
    </button>
    <h3 className="-mt-3 text-lg font-bold">Modal Error</h3>
    <div className="mt-4 px-2 text-sm text-error">
      Failed to open modal `{modalType}`: {reason}
    </div>
    <div className="mt-4 flex justify-end px-2">
      <button className="btn btn-primary btn-outline" onClick={close} type="button">
        Close
      </button>
    </div>
  </div>
);

const MODAL_REGISTRY = {
  serverInfo: {
    component: ServerInfoModal,
    validateProps: validateOk,
    defaultOptions: {},
  },
  // "port" is currently used by the add-port button and opens the same modal shell.
  port: {
    component: PortFunctionModal,
    validateProps: validateOk,
    defaultOptions: {},
  },
  portFunction: {
    component: PortFunctionModal,
    validateProps: requireField(["port", "id"]),
    defaultOptions: {},
  },
  portRestriction: {
    component: PortRestrictionModal,
    validateProps: requireField(["port", "id"]),
    defaultOptions: {},
  },
  file: {
    component: FileModal,
    validateProps: validateOk,
    defaultOptions: {},
  },
  filePreview: {
    component: FilePreviewModal,
    validateProps: requireField(["file"]),
    defaultOptions: {},
  },
  confirmation: {
    component: ConfirmationModal,
    validateProps: confirmationValidator,
    defaultOptions: {},
  },
  loading: {
    component: LoadingModalContent,
    validateProps: validateOk,
    defaultOptions: {
      dismissible: false,
      closeOnBackdrop: false,
      closeOnEsc: false,
    },
  },
};

const ModalManager = () => {
  const { stack, topModal, close, resolveModal } = useModal();

  useEffect(() => {
    if (!topModal) return;
    const options = topModal.options || {};
    if (options.dismissible === false || options.closeOnEsc === false) return;

    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      close(topModal.id);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [topModal?.id, topModal?.options?.dismissible, topModal?.options?.closeOnEsc]);

  if (!stack.length) {
    return null;
  }

  return (
    <>
      {stack.map((modal, index) => {
        const isTop = index === stack.length - 1;
        const descriptor = MODAL_REGISTRY[modal.type];
        const Content = descriptor?.component;
        const validation = descriptor
          ? (descriptor.validateProps?.(modal.props || {}) ?? { ok: true })
          : { ok: false, reason: `Unknown modal type: ${modal.type}` };
        const options = {
          hasBackdrop: true,
          closeOnBackdrop: true,
          closeOnEsc: true,
          dismissible: true,
          ...(descriptor?.defaultOptions || {}),
          ...(modal.options || {}),
        };

        const closeCurrent = () => close(modal.id);
        const resolveCurrent = (value) => resolveModal(modal.id, value);

        if (!descriptor || !validation.ok) {
          console.warn("[modal] invalid modal", {
            type: modal.type,
            props: modal.props,
            reason: validation.reason,
          });
        }

        return (
          <div
            key={modal.id}
            className={classNames("modal modal-bottom sm:modal-middle modal-open", {
              "pointer-events-none": !isTop,
            })}
            style={{ zIndex: 2000 + index * 10 }}
            aria-hidden={!isTop}
          >
            {descriptor && validation.ok ? (
              <Content
                modalId={modal.id}
                modalProps={modal.props || {}}
                close={closeCurrent}
                resolve={resolveCurrent}
                isTop={isTop}
              />
            ) : (
              <InvalidModalContent
                modalType={modal.type}
                reason={validation.reason}
                close={closeCurrent}
              />
            )}
            {isTop && options.hasBackdrop && (
              <div
                className="modal-backdrop"
                onClick={() => {
                  if (options.dismissible === false || options.closeOnBackdrop === false) {
                    return;
                  }
                  closeCurrent();
                }}
              />
            )}
          </div>
        );
      })}
    </>
  );
};

export default ModalManager;

