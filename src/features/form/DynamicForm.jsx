import { useEffect } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
} from "react-hook-form";
import classNames from "classnames";
import schema from "./schema";
import { Plus, Trash } from "lucide-react";
import { get } from "../../utils/object";

const renderForms = (register, control, errors, setValue, schema, parent = null) => {
  return Object.entries(schema).map(([key, field]) =>
    renderFormControl(register, control, errors, setValue, key, field, parent)
  );
};
const renderListInput = (register, control, errors, setValue, listKey, listItemSchema, parent = null) => {
  const fieldArray = useFieldArray({
    control,
    name: listKey,
  });
  return (
    <div className="form-control bordered mb-2 w-full max-w-xs rounded-xl border-2 border-accent/30" key={listKey}>
      <label className="label py-1">
        <span className="label-text">{schema[listKey].label}</span>
        <span className="label-text-alt">
          <button className="btn btn-circle btn-outline btn-xs" onClick={() => fieldArray.append("") }>
            <Plus className="mx-1" size={18} />
          </button>
        </span>
      </label>
      {fieldArray.fields.map((item, index) => (
        <div
          className="form-control w-full max-w-xs flex-row items-start pl-2"
          key={item.id}
        >
          {renderFormControl(
            register,
            control,
            errors,
            setValue,
            `${listKey}.${index}`,
            listItemSchema,
            parent
          )}
          <Trash
            className={classNames(
              "mx-1 flex-none cursor-pointer text-error/70",
              listItemSchema.label && "mt-11"
            )}
            size={16}
            onClick={() => fieldArray.remove(index)}
          />
        </div>
      ))}
    </div>
  );
};
const renderFormControl = (register, control, errors, setValue, key, field, parent = null) => {
  const formKey = parent ? parent + "." + key : key;
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValue(name, value);
  };
  switch (field.type) {
    case "text":
    case "email":
    case "number":
    case "password":
      return (
        <div className="form-control w-full max-w-xs" key={formKey}>
          <label className="label py-1">
            <span className="label-text">{field.label}</span>
          </label>
          {/* <input
            className={classNames("input input-bordered", {
              "input-error": get(errors, formKey),
            })}
            type={field.type}
            onChange={handleInputChange}
            {...register(key, field.validation)}
          /> */}
          <Controller
            name={formKey}
            control={control}
            rules={field.validation}
            render={({ field: f }) => (
              <input
                className={classNames("input input-bordered", {
                  "input-error": get(errors, formKey),
                })}
                type={field.type}
                {...f}
              />
            )}
          />

          <label className="label py-1">
            <span className="label-text-alt text-error">
              {get(errors, formKey, null) && (
                <span>{get(errors, formKey).message}</span>
              )}
            </span>
          </label>
        </div>
      );
    case "select":
      return (
        <div className="form-control w-full max-w-xs" key={formKey}>
          <label className="label py-1">
            <span className="label-text">{field.label}</span>
          </label>
          <select
            className="select select-bordered"
            onChange={handleInputChange}
            {...register(formKey, field.validation)}
          >
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <label className="label py-1">
            <span className="label-text-alt text-error">
              {get(errors, formKey) && <span>{get(errors, formKey).message}</span>}
            </span>
          </label>
        </div>
      );
    case "checkbox":
      return (
        <div className="form-control w-full max-w-xs" key={formKey}>
          <label className="label cursor-pointer py-1">
            <span className="label-text">{field.label}</span>
            <input
              className="checkbox"
              type="checkbox"
              onChange={handleInputChange}
              {...register(formKey, field.validation)}
            />
          </label>
          {get(errors, formKey) && (
            <span className="label-text-alt pb-2 text-error">
              <span>{get(errors, formKey).message}</span>
            </span>
          )}
        </div>
      );
    case "object":
      return (
        <div className="form-control bordered mb-2 w-full max-w-xs rounded-xl border-2 border-accent/30" key={formKey}>
          <label className="label py-1">
            <span className="label-text">{field.label}</span>
          </label>
          <div className="form-control w-full max-w-xs items-start pl-2 pr-1">
            {renderForms(register, control, errors, setValue, field.of, formKey)}
          </div>
        </div>
      );
    case "list":
      return renderListInput(register, control, errors, setValue, key, field.values, parent);
    default:
      return null;
  }
};
const DynamicForm = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm()

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
      <form onSubmit={handleSubmit(onSubmit)}>
        {renderForms(register, control, errors, setValue, schema)}
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
  );
};

export default DynamicForm;
