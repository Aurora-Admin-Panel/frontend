import { createSlice } from '@reduxjs/toolkit'


export const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    isOpen: false,
    modalType: null,
    modalProps: {},
    onConfirm: null,
    onCancel: null,
  },
  reducers: {
    showModal: (state, action) => {
      const { modalType, modalProps, onConfirm, onCancel } = action.payload
      state.isOpen = true
      state.modalType = modalType
      state.modalProps = modalProps || {}
      state.onConfirm = onConfirm || null
      state.onCancel = onCancel || null
    },
    hideModal: (state, action) => {
      state.isOpen = false
      state.modalType = null
      state.modalProps = {}
      state.onConfirm = null
      state.onCancel = null
    }
  }
})

export const { showModal, hideModal } = modalSlice.actions 
export default modalSlice.reducer