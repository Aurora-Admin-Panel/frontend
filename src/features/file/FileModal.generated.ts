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
export type UploadFileMutationVariables = Types.Exact<{
  file: Types.Scalars['Upload'];
  name: Types.Scalars['String'];
  type: Types.FileTypeEnum;
  version?: Types.InputMaybe<Types.Scalars['String']>;
  notes?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type UploadFileMutation = { __typename?: 'Mutation', uploadFile: { __typename?: 'File', id: number, name: string, type: Types.FileTypeEnum, size: any, version?: string, notes?: string } };


export const UploadFileDocument = `
    mutation UploadFile($file: Upload!, $name: String!, $type: FileTypeEnum!, $version: String, $notes: String) {
  uploadFile(
    file: $file
    name: $name
    type: $type
    version: $version
    notes: $notes
  ) {
    id
    name
    type
    size
    version
    notes
  }
}
    `;

const injectedRtkApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    UploadFile: build.mutation<UploadFileMutation, UploadFileMutationVariables>({
      query: (variables) => ({ document: UploadFileDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };
export const { useUploadFileMutation } = injectedRtkApi;
