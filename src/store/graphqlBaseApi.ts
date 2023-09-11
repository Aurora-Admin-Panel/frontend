import { createApi } from '@reduxjs/toolkit/query/react'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'
import { GraphQLClient, ClientError } from 'graphql-request'
import { store } from '.'
import { showBanner } from './reducers/banner'
import { showNotification } from './reducers/notification'


export const client = new GraphQLClient('/api/graphql', {
  errorPolicy: 'ignore',
  requestMiddleware: (request) => {
    const token: string | undefined = store.getState().auth.token
    return {
      ...request,
      headers: {
        ...request.headers,
        'Authorization': `Bearer ${token}`
      }
    }
  },
  responseMiddleware: (response: ClientError | any) => {
    if (response instanceof ClientError) {
      console.log(response)
      if (response.response.errors && response.response.errors.length > 0) {
        if (response.response.errors[0].message === 'User is not authenticated') {
          store.dispatch(showNotification({ type: 'error', body: 'You are not logged in' }))
        } else {
          for (const error of response.response.errors) {
            store.dispatch(showNotification({ type: 'error', body: error.message, duration: 10000 }))
          }
        }
      }
    }
    return response;
  }
})

export const api = createApi({
  reducerPath: 'graphqlApi',
  baseQuery: graphqlRequestBaseQuery({ client }),
  keepUnusedDataFor: 60,
  refetchOnMountOrArgChange: false,
  endpoints: () => ({})
})