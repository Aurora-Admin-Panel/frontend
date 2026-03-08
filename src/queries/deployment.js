import { gql } from "@apollo/client";

// --- Bindings ---

export const GET_FILE_CONTRACT_BINDINGS = gql`
  query GetFileContractBindings($fileId: Int, $contractId: Int) {
    fileContractBindings(fileId: $fileId, contractId: $contractId) {
      id
      fileId
      contractId
      isDefault
      createdAt
    }
  }
`;

export const CREATE_FILE_CONTRACT_BINDING = gql`
  mutation CreateFileContractBinding(
    $fileId: Int!
    $contractId: Int!
    $isDefault: Boolean
  ) {
    createFileContractBinding(
      fileId: $fileId
      contractId: $contractId
      isDefault: $isDefault
    ) {
      id
      fileId
      contractId
      isDefault
      createdAt
    }
  }
`;

export const DELETE_FILE_CONTRACT_BINDING = gql`
  mutation DeleteFileContractBinding($id: Int!) {
    deleteFileContractBinding(id: $id)
  }
`;

// --- Deployments ---

export const GET_SERVER_DEPLOYMENT = gql`
  query GetServerDeployment($id: Int!) {
    serverDeployment(id: $id) {
      id
      bindingId
      contractId
      serverId
      valuesJson
      status
      isActive
      createdAt
      updatedAt
      contractTitle
      logs {
        id
        action
        status
        output
        taskId
        createdAt
        finishedAt
      }
      binding {
        id
        fileId
        contractId
      }
    }
  }
`;

export const GET_PAGINATED_SERVER_DEPLOYMENTS = gql`
  query GetPaginatedServerDeployments(
    $limit: Int
    $offset: Int
    $serverId: Int
    $bindingId: Int
    $status: String
  ) {
    paginatedServerDeployments(
      limit: $limit
      offset: $offset
      serverId: $serverId
      bindingId: $bindingId
      status: $status
    ) {
      items {
        id
        bindingId
        contractId
        serverId
        valuesJson
        status
        isActive
        createdAt
        updatedAt
        contractTitle
      }
      count
    }
  }
`;

// --- Lifecycle mutations ---

export const DEPLOY_EXECUTABLE = gql`
  mutation DeployExecutable(
    $bindingId: Int!
    $serverIds: [Int!]!
    $values: JSON!
  ) {
    deployExecutable(
      bindingId: $bindingId
      serverIds: $serverIds
      values: $values
    ) {
      id
      bindingId
      serverId
      status
      createdAt
      updatedAt
    }
  }
`;

export const DEPLOY_CONTRACT = gql`
  mutation DeployContract(
    $contractId: Int!
    $serverIds: [Int!]!
    $values: JSON!
  ) {
    deployContract(
      contractId: $contractId
      serverIds: $serverIds
      values: $values
    ) {
      id
      contractId
      serverId
      status
      createdAt
      updatedAt
    }
  }
`;

export const REDEPLOY_EXECUTABLE = gql`
  mutation RedeployExecutable($deploymentId: Int!, $values: JSON) {
    redeployExecutable(deploymentId: $deploymentId, values: $values) {
      id
      action
      status
      taskId
      createdAt
    }
  }
`;

export const STOP_DEPLOYMENT = gql`
  mutation StopDeployment($deploymentId: Int!) {
    stopDeployment(deploymentId: $deploymentId) {
      id
      action
      status
      taskId
      createdAt
    }
  }
`;

export const START_DEPLOYMENT = gql`
  mutation StartDeployment($deploymentId: Int!) {
    startDeployment(deploymentId: $deploymentId) {
      id
      action
      status
      taskId
      createdAt
    }
  }
`;

export const REMOVE_DEPLOYMENT = gql`
  mutation RemoveDeployment($deploymentId: Int!) {
    removeDeployment(deploymentId: $deploymentId) {
      id
      action
      status
      taskId
      createdAt
    }
  }
`;

// --- Subscriptions ---

export const TASK_STREAM_SUBSCRIPTION = gql`
  subscription TaskStream($taskId: String!) {
    taskStream(taskId: $taskId)
  }
`;

// --- Helper queries for deploy form ---

export const GET_EXECUTABLE_FILES = gql`
  query GetExecutableFiles {
    files(type: EXECUTABLE) {
      id
      name
      version
      size
    }
  }
`;

export const GET_CONTRACTS_FOR_BINDING = gql`
  query GetContractsForBinding {
    executableContracts(isActive: true) {
      id
      contractKey
      version
      title
      isBuiltin
      hasSource
      schemaJson
    }
  }
`;
