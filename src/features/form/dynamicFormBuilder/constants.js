import { gql } from "@apollo/client";

export const LIST_EXECUTABLE_CONTRACTS = gql`
  query ListExecutableContracts($limit: Int, $offset: Int) {
    paginatedExecutableContracts(limit: $limit, offset: $offset) {
      count
      items {
        id
        contractKey
        version
        title
        description
        isActive
        updatedAt
        schemaJson
      }
    }
  }
`;

export const CREATE_EXECUTABLE_CONTRACT = gql`
  mutation CreateExecutableContract($schemaJson: JSON!) {
    createExecutableContract(schemaJson: $schemaJson) {
      id
      contractKey
      version
      title
      description
      isActive
      updatedAt
      schemaJson
    }
  }
`;

export const UPDATE_EXECUTABLE_CONTRACT = gql`
  mutation UpdateExecutableContract($id: Int!, $schemaJson: JSON!, $isActive: Boolean) {
    updateExecutableContract(id: $id, schemaJson: $schemaJson, isActive: $isActive)
  }
`;

export const COMPILE_EXECUTABLE_CONTRACT_PREVIEW = gql`
  mutation CompileExecutableContractPreview($contract: JSON!, $values: JSON!, $context: JSON) {
    compileExecutableContractPreview(contract: $contract, values: $values, context: $context)
  }
`;

export const COMPILE_EXECUTABLE_CONTRACT_PREVIEW_BY_ID = gql`
  mutation CompileExecutableContractPreviewById($id: Int!, $values: JSON!, $context: JSON) {
    compileExecutableContractPreviewById(id: $id, values: $values, context: $context)
  }
`;

export const DEFAULT_CONTRACT_TEMPLATE = {
  schemaVersion: "exec-authoring/v1",
  contractKey: "demo_contract",
  version: 1,
  title: "Demo Contract",
  description: "Edit this contract and save it.",
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
