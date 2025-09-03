import schemaRaw from "./schema.json?raw";
import useDynamicForm from "./useDynamicForm";

// Backward-compatible component that uses the hook and JSON schema
const schema = JSON.parse(schemaRaw);

const DynamicForm = ({ schema: schemaProp, onSubmit }) => {
  const { form } = useDynamicForm({
    schema: schemaProp || schema,
    onSubmit: onSubmit || ((data) => console.log(data)),
  });
  return <div className="mx-auto px-10">{form}</div>;
};

export default DynamicForm;
