import { gql } from "@apollo/client";

export const LIST_SERVICE_DEFINITIONS = gql`
  query ListServiceDefinitions($limit: Int, $offset: Int) {
    paginatedServiceDefinitions(limit: $limit, offset: $offset) {
      count
      items {
        id
        serviceKey
        version
        title
        description
        isActive
        updatedAt
        configJson
      }
    }
  }
`;

export const CREATE_SERVICE_DEFINITION = gql`
  mutation CreateServiceDefinition($configJson: JSON!) {
    createServiceDefinition(configJson: $configJson) {
      id
      serviceKey
      version
      title
      description
      isActive
      updatedAt
      configJson
    }
  }
`;

export const UPDATE_SERVICE_DEFINITION = gql`
  mutation UpdateServiceDefinition($id: Int!, $configJson: JSON!, $isActive: Boolean) {
    updateServiceDefinition(id: $id, configJson: $configJson, isActive: $isActive)
  }
`;

export const COMPILE_SERVICE_PREVIEW = gql`
  mutation CompileServicePreview($contract: JSON!, $values: JSON!, $context: JSON) {
    compileServicePreview(contract: $contract, values: $values, context: $context)
  }
`;

export const COMPILE_SERVICE_PREVIEW_BY_ID = gql`
  mutation CompileServicePreviewById($id: Int!, $values: JSON!, $context: JSON) {
    compileServicePreviewById(id: $id, values: $values, context: $context)
  }
`;

export const DEFAULT_SERVICE_TEMPLATE = {
  schemaVersion: "aurora-exec/v1",
  contractKey: "demo_service",
  version: 1,
  title: "Demo Service",
  description: "Edit this service definition and save it.",
  exec: {
    bin: "/usr/bin/echo",
    baseArgs: ["hello"],
    timeoutSeconds: 300,
  },
  ui: {
    grid: {
      cols: { base: 1, md: 12 },
      gap: 4,
    },
  },
  params: [
    {
      key: "name",
      type: "string",
      label: "Name",
      required: true,
      ui: {
        grid: { colSpan: { base: 12, md: 6 } },
      },
      emit: { arg: "--name" },
    },
    {
      key: "verbose",
      type: "bool",
      label: "Verbose",
      default: false,
      ui: {
        grid: { colSpan: { base: 12, md: 6 } },
      },
      emit: { flag: "--verbose" },
    },
  ],
};
