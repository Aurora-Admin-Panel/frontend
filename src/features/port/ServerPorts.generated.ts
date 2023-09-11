/* eslint-disable */
/**
 *
 * THIS FILE IS AUTOGENERATED, DO NOT EDIT IT!
 *
 * instead, edit one of queries in this project and run
 *
 * npm run generate
 *
 * for this file to be re-created
 */

import * as Types from '../../store/apis/types.generated';

import { api } from 'src/store/graphqlBaseApi';
export type GetServerPortsQueryVariables = Types.Exact<{
  serverId: Types.Scalars['Int'];
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  orderBy?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type GetServerPortsQuery = { __typename?: 'Query', paginatedPorts: { __typename?: 'PortPaginationWindow', count: number, items: Array<{ __typename?: 'Port', id: number, num: number, externalNum?: number, notes?: string, config: any, allowedUsers: Array<{ __typename?: 'PortUser', user: { __typename?: 'User', id: number, email: string } }>, users: Array<{ __typename?: 'User', id: number, email: string }>, forwardRule?: { __typename?: 'PortForwardRule', id: number, method: Types.MethodEnum, status: string }, usage?: { __typename?: 'PortUsage', download: any, upload: any } }> } };


export const GetServerPortsDocument = `
    query GetServerPorts($serverId: Int!, $limit: Int, $offset: Int, $orderBy: String) {
  paginatedPorts(
    serverId: $serverId
    limit: $limit
    offset: $offset
    orderBy: $orderBy
  ) {
    items {
      id
      num
      externalNum
      notes
      config
      allowedUsers {
        user {
          id
          email
        }
      }
      users {
        id
        email
      }
      forwardRule {
        id
        method
        status
      }
      usage {
        download
        upload
      }
    }
    count
  }
}
    `;

const injectedRtkApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    GetServerPorts: build.query<GetServerPortsQuery, GetServerPortsQueryVariables>({
      query: (variables) => ({ document: GetServerPortsDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };
export const { useGetServerPortsQuery, useLazyGetServerPortsQuery } = injectedRtkApi;

