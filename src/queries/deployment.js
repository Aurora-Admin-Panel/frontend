import { gql } from "@apollo/client";

// --- Service Bindings ---

export const GET_SERVICE_BINDINGS = gql`
  query GetServiceBindings($fileId: Int, $serviceId: Int) {
    serviceBindings(fileId: $fileId, serviceId: $serviceId) {
      id
      fileId
      serviceId
      isDefault
      createdAt
      file {
        id
        name
        version
        size
      }
      service {
        id
        serviceKey
        version
        title
        isBuiltin
        hasSource
        configJson
      }
    }
  }
`;

export const CREATE_SERVICE_BINDING = gql`
  mutation CreateServiceBinding(
    $fileId: Int!
    $serviceId: Int!
    $isDefault: Boolean
  ) {
    createServiceBinding(
      fileId: $fileId
      serviceId: $serviceId
      isDefault: $isDefault
    ) {
      id
      fileId
      serviceId
      isDefault
      createdAt
    }
  }
`;

export const DELETE_SERVICE_BINDING = gql`
  mutation DeleteServiceBinding($id: Int!) {
    deleteServiceBinding(id: $id)
  }
`;

// --- Deployments ---

export const GET_SERVER_DEPLOYMENT = gql`
  query GetServerDeployment($id: Int!) {
    serverDeployment(id: $id) {
      id
      serviceBindingId
      serviceId
      serverId
      portId
      valuesJson
      status
      isActive
      createdAt
      updatedAt
      serviceTitle
      port {
        num
        externalNum
      }
      logs {
        id
        action
        status
        output
        taskId
        createdAt
        finishedAt
      }
      serviceBinding {
        id
        fileId
        serviceId
      }
    }
  }
`;

export const GET_PAGINATED_SERVER_DEPLOYMENTS = gql`
  query GetPaginatedServerDeployments(
    $limit: Int
    $offset: Int
    $serverId: Int
    $serviceBindingId: Int
    $status: String
  ) {
    paginatedServerDeployments(
      limit: $limit
      offset: $offset
      serverId: $serverId
      serviceBindingId: $serviceBindingId
      status: $status
    ) {
      items {
        id
        serviceBindingId
        serviceId
        serverId
        portId
        valuesJson
        status
        isActive
        createdAt
        updatedAt
        serviceTitle
        port {
          num
          externalNum
        }
      }
      count
    }
  }
`;

// --- Lifecycle mutations ---

export const DEPLOY_EXECUTABLE = gql`
  mutation DeployExecutable(
    $serviceBindingId: Int!
    $serverIds: [Int!]!
    $values: JSON!
    $portId: Int
  ) {
    deployExecutable(
      serviceBindingId: $serviceBindingId
      serverIds: $serverIds
      values: $values
      portId: $portId
    ) {
      id
      serviceBindingId
      serverId
      portId
      status
      createdAt
      updatedAt
    }
  }
`;

export const DEPLOY_SERVICE = gql`
  mutation DeployService(
    $serviceId: Int!
    $serverIds: [Int!]!
    $values: JSON!
    $portId: Int
  ) {
    deployService(
      serviceId: $serviceId
      serverIds: $serverIds
      values: $values
      portId: $portId
    ) {
      id
      serviceId
      serverId
      portId
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

export const GET_SERVICES_FOR_BINDING = gql`
  query GetServicesForBinding {
    serviceDefinitions(isActive: true) {
      id
      serviceKey
      version
      title
      isBuiltin
      hasSource
      configJson
    }
  }
`;

export const GET_AVAILABLE_PORTS = gql`
  query GetAvailablePorts($serverId: Int!) {
    availablePortsForDeployment(serverId: $serverId) {
      id
      num
      externalNum
    }
  }
`;
