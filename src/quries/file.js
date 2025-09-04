import { gql } from "@apollo/client";


export const GET_SECRETS_QUERY = gql`
  query GetSecrets {
    files(type: SECRET) {
      id
      name
      version
      createdAt
      updatedAt
    }
  }
`;

export const GET_FILES_QUERY = gql`
  query GetFiles($limit: Int, $offset: Int) {
    paginatedFiles(limit: $limit, offset: $offset) {
      items {
        id
        name
        path
        type
        size
        version
        notes
        createdAt
        updatedAt
      }
      count
    }
  }
`;

export const UPLOAD_FILE_MUTATION = gql`
  mutation UploadFile(
    $file: Upload!
    $name: String!
    $type: FileTypeEnum!
    $version: String
    $notes: String
  ) {
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

export const DELETE_FILE_MUTATION = gql`
  mutation DeleteFile($id: Int!) {
    deleteFile(id: $id)
  }
`;