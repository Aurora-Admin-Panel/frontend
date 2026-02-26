import schemaRaw from "../schema.json?raw";
import useDynamicForm from "../useDynamicForm";

const schema = JSON.parse(schemaRaw);

export default function LegacyDynamicForm({ schema: schemaProp, onSubmit }) {
  const { form } = useDynamicForm({
    schema: schemaProp || schema,
    onSubmit: onSubmit || ((data) => console.log(data)),
  });

  return <div className="mx-auto px-10">{form}</div>;
}
