import { createSlice } from '@reduxjs/toolkit'


export const bannerSlice = createSlice({
  name: 'banner',
  initialState: {
    show: false,
    title: '',
    body: '',
    type: ''
  },
  reducers: {
    showBanner: (state, action) => {
      const { title, body, type } = action.payload
      state.show = true
      state.title = title
      state.body = body
      state.type = type
    },
    clearBanner: state => {
      state.show = false
      state.title = ''
      state.body = ''
      state.type = ''
    }
  }
})

export const showBanner = (title = "", body = "", type = '') => {
  return (dispatch) => {
    dispatch(bannerSlice.actions.showBanner({ title, body, type }));
    setTimeout(() => dispatch(bannerSlice.actions.clearBanner()), 3000);
  };
};

export const clearBanner = () => {
  return (dispatch) => {
    dispatch(bannerSlice.actions.clearBanner());
  };
};

export default bannerSlice.reducer