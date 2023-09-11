import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { v4 as uuidv4 } from 'uuid';
import { setQueryID, removeQueryID } from './reducers/websocket'
import {
  sendMessage,
  addMessageListener,
  removeMessageListener,
} from './websocketManager';


export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    }
  }),
  endpoints: (builder) => ({
    WS: builder.query<void, number>({
      queryFn: async (arg: any, { getState }) => {
        const id = getState().websocket.ids[JSON.stringify(arg)]
        if (Array.isArray(arg)) {
          for (const a of arg) {
            sendMessage(JSON.stringify({ id, ...a }))
          }
        } else if (typeof arg === 'object') {
          sendMessage(JSON.stringify({ id, ...arg }))
        } else {
          sendMessage(JSON.stringify({ id, arg }))
        }
        return { data: [] }
      },
      async onCacheEntryAdded(arg: any, { dispatch, updateCachedData, cacheDataLoaded, cacheEntryRemoved, getCacheEntry }) {
        const id = uuidv4()
        dispatch(setQueryID({ id, arg }))
        const listener = (event: any) => {
          const data = JSON.parse(event.data)
          if (data.id !== id) return // filter out messages not for this query

          updateCachedData((draft) => {
            draft.push(data)
          })
        }
        try {
          await cacheDataLoaded;

          addMessageListener(listener)
        } catch (e) {
          console.error(e)
          // if cacheEntryRemoved resolves before cacheDataLoaded,
          // cacheDataLoaded throws an error
        }
        await cacheEntryRemoved;
        dispatch(removeQueryID({ arg }))
        removeMessageListener(listener)
      },
    }),
  }),
});

export const { useWSQuery } = api;