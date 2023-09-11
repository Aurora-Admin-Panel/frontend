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
export type DeleteFileMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type DeleteFileMutation = { __typename?: 'Mutation', deleteFile: boolean };


export const DeleteFileDocument = `
    mutation DeleteFile($id: Int!) {
  deleteFile(id: $id)
}
    `;

const injectedRtkApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    DeleteFile: build.mutation<DeleteFileMutation, DeleteFileMutationVariables>({
      query: (variables) => ({ document: DeleteFileDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };
export const { useDeleteFileMutation } = injectedRtkApi;

