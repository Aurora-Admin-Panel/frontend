import { useReducerAtom, atomWithStorage } from "jotai/utils";

export const modalAtom = atomWithStorage('modal', {
    isOpen: false,
    modalType: null,
    modalProps: {},
    onConfirm: null,
    onCancel: null,
})

const modalReducer = (prev, action) => {
    if (action.type === 'showModal') {
        return {
            isOpen: true,
            modalType: action.payload.modalType,
            modalProps: action.payload.modalProps || {},
            onConfirm: action.payload.onConfirm || null,
            onCancel: action.payload.onCancel || null,
        }
    } else if (action.type === 'hideModal') {
        return {
            isOpen: false,
            modalType: null,
            modalProps: {},
            onConfirm: null,
            onCancel: null,
        }
    } else if (action.type === 'showConfirmationModal') {
        console.log(action.payload.dispatch)
        const { dispatch } = action.payload
        return {
            isOpen: true,
            modalType: 'confirmation',
            modalProps: action.payload.modalProps || {},
            onConfirm: action.payload.onConfirm || null,
            onCancel: () => dispatch({ type: 'showModal', payload: { ...prev } }),
        }
    } else {
        throw new Error(`unhandled action type: ${action.type}`)
    }
}

export const useModalReducer = () => {
    const [modal, dispatch] = useReducerAtom(modalAtom, modalReducer);
    return {
        modal,
        showModal: (payload) => dispatch({ type: 'showModal', payload }),
        hideModal: () => dispatch({ type: 'hideModal' }),
        showConfirmationModal: (payload) => dispatch({ type: 'showConfirmationModal', payload: { ...payload, dispatch } }),
    }
}
