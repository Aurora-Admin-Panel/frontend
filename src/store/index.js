import thunk from "redux-thunk";
import { combineReducers } from "redux";
import storage from 'redux-persist/lib/storage'
import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'

import reducers from "./reducers";
import { api as baseApi } from './baseApi';

const persistConfig = {
  key: 'aurora-1.0.0-pre999999',
  storage,
  blacklist: [baseApi.reducerPath, 'modal', 'websocket', 'notification']
}
const store = configureStore({
  reducer: persistReducer(persistConfig, combineReducers({
    [baseApi.reducerPath]: baseApi.reducer,
    ...reducers
  })),
  devTools: import.meta.env.DEV,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }).concat(baseApi.middleware, thunk)
})
const persistor = persistStore(store)

export { persistor, store }
