import { createSlice } from '@reduxjs/toolkit'


export const wsSlice = createSlice({
  name: 'websocket',
  initialState: {
    ids: {}
  },
  reducers: {
    setQueryID: (state, action) => {
      const { arg, id } = action.payload
      state.ids[JSON.stringify(arg)] = id
    },
    removeQueryID: (state, action) => {
      const { arg } = action.payload
      delete state.ids[JSON.stringify(arg)]
    }
  }
})

export const { setQueryID, removeQueryID } = wsSlice.actions 
export default wsSlice.reducer