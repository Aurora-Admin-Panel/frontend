import { atom, useAtom } from "jotai";

let modalCounter = 0;

const createModalId = () => {
  if (typeof globalThis?.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  modalCounter += 1;
  return `modal-${Date.now()}-${modalCounter}`;
};

const settleModal = (modal, value) => {
  if (!modal || modal._settled || typeof modal.resolver !== "function") {
    return;
  }
  modal._settled = true;
  modal.resolver(value);
};

export const modalAtom = atom({
  stack: [],
});

export const useModal = () => {
  const [modalState, setModalState] = useAtom(modalAtom);

  const open = (type, props = {}, options = {}) => {
    const { defaultResult, ...modalOptions } = options || {};
    const modalId = createModalId();

    const promise = new Promise((resolver) => {
      setModalState((prev) => ({
        ...prev,
        stack: [
          ...prev.stack,
          {
            id: modalId,
            type,
            props: props || {},
            options: {
              hasBackdrop: true,
              closeOnBackdrop: true,
              closeOnEsc: true,
              dismissible: true,
              ...modalOptions,
            },
            defaultResult,
            createdAt: Date.now(),
            resolver,
            _settled: false,
          },
        ],
      }));
    });

    promise.modalId = modalId;
    return promise;
  };

  const resolveModal = (modalId, value) => {
    setModalState((prev) => {
      const target = prev.stack.find((modal) => modal.id === modalId);
      settleModal(target, value);
      return prev;
    });
  };

  const close = (modalId) => {
    setModalState((prev) => {
      if (!prev.stack.length) return prev;

      const targetId = modalId || prev.stack[prev.stack.length - 1].id;
      const target = prev.stack.find((modal) => modal.id === targetId);
      if (!target) return prev;

      settleModal(target, target.defaultResult);

      return {
        ...prev,
        stack: prev.stack.filter((modal) => modal.id !== targetId),
      };
    });
  };

  const closeAll = () => {
    setModalState((prev) => {
      prev.stack.forEach((modal) => settleModal(modal, modal.defaultResult));
      return {
        ...prev,
        stack: [],
      };
    });
  };

  const replaceTop = (type, props = {}, options = {}) => {
    close();
    return open(type, props, options);
  };

  const confirm = async (props = {}, options = {}) => {
    const result = await open("confirmation", props, {
      defaultResult: false,
      ...options,
    });
    return Boolean(result);
  };

  const stack = modalState.stack || [];
  const topModal = stack[stack.length - 1] || null;

  return {
    stack,
    isOpen: stack.length > 0,
    topModal,
    open,
    close,
    closeAll,
    replaceTop,
    resolveModal,
    confirm,
  };
};

