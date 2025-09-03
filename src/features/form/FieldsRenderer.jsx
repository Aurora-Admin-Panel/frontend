import TextField from "./TextField";
import SelectField from "./SelectField";
import CheckboxField from "./CheckboxField";
import ObjectField from "./ObjectField";
import ListField from "./ListField";
import { normalizeValidation } from "./utils";

const FieldsRenderer = ({ schema, parent = null, register, control, errors, setValue }) => {
  return (
    <>
      {Object.entries(schema).map(([key, field]) => {
        const name = parent ? `${parent}.${key}` : key;
        switch (field.type) {
          case "text":
          case "email":
          case "number":
          case "password":
            return (
              <TextField
                key={name}
                control={control}
                errors={errors}
                name={name}
                label={field.label}
                type={field.type}
                rules={normalizeValidation(field.validation)}
              />
            );
          case "select":
            return (
              <SelectField
                key={name}
                register={register}
                errors={errors}
                name={name}
                label={field.label}
                options={field.options || []}
                rules={normalizeValidation(field.validation)}
              />
            );
          case "checkbox":
            return (
              <CheckboxField
                key={name}
                register={register}
                errors={errors}
                name={name}
                label={field.label}
                rules={normalizeValidation(field.validation)}
              />
            );
          case "object":
            return (
              <ObjectField
                key={name}
                schema={field.of}
                parent={parent}
                register={register}
                control={control}
                errors={errors}
                setValue={setValue}
                name={key}
                label={field.label}
              />
            );
          case "list":
            return (
              <ListField
                key={name}
                name={key}
                label={field.label}
                itemSchema={field.values}
                parent={parent}
                register={register}
                control={control}
                errors={errors}
                setValue={setValue}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
};

export default FieldsRenderer;
