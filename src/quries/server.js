import { gql } from "@apollo/client";

export const GET_SERVERS_QUERY = gql`
  query GetServers($limit: Int, $offset: Int) {
    paginatedServers(limit: $limit, offset: $offset) {
      items {
        id
        name
        address
        portUsed
        portTotal
        downloadTotal
        uploadTotal
      }
      count
    }
  }
`;


export const GET_SERVER_QUERY = gql`
  query GetServer($id: Int!) {
    server(id: $id) {
      id
      name
      address
      user
      host
      port
      sshPasswordSet
      sudoPasswordSet
      keyFileId
    }
  }
`;

export const ADD_SERVER_MUTATION = gql`
  mutation AddServer(
    $name: String!
    $address: String!
    $user: String
    $host: String
    $port: Int
    $sshPassword: String
    $sudoPassword: String
    $keyFileId: Int
  ) {
    addServer(
      name: $name
      address: $address
      user: $user
      host: $host
      port: $port
      sshPassword: $sshPassword
      sudoPassword: $sudoPassword
      keyFileId: $keyFileId
    )
  }
`;
export const UPDATE_SERVER_MUTATION = gql`
  mutation UpdateServer(
    $id: Int!
    $name: String!
    $address: String!
    $user: String
    $host: String
    $port: Int
    $sshPassword: String
    $sudoPassword: String
    $keyFileId: Int
  ) {
    updateServer(
      id: $id
      name: $name
      address: $address
      user: $user
      host: $host
      port: $port
      sshPassword: $sshPassword
      sudoPassword: $sudoPassword
      keyFileId: $keyFileId
    )
  }
`;

export const DELETE_SERVER_MUTATION = gql`
  mutation DeleteServer($id: Int!) {
    deleteServer(id: $id)
  }
`;