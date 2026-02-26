import LegacyDynamicForm from "./dynamicFormBuilder/LegacyDynamicForm";
import ExecutableContractWorkbench from "./dynamicFormBuilder/ExecutableContractWorkbench";

const DynamicForm = ({ schema: schemaProp, onSubmit }) => {
  if (schemaProp) {
    return <LegacyDynamicForm schema={schemaProp} onSubmit={onSubmit} />;
  }

  return <ExecutableContractWorkbench />;
};

export default DynamicForm;
