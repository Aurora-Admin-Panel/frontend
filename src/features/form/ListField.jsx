import { useFieldArray } from "react-hook-form";
import { Plus, Trash } from "lucide-react";
import FieldsRenderer from "./FieldsRenderer";
import useMaybeT from "../../hooks/useMaybeT";

const ListField = ({ name, label, itemSchema, parent, register, control, errors, setValue }) => {
  const fullName = parent ? `${parent}.${name}` : name;
  const fieldArray = useFieldArray({ control, name: fullName });
  const maybeT = useMaybeT();

  return (
    <fieldset className="fieldset w-full max-w-xs px-2" key={fullName}>
      <legend className="fieldset-legend flex items-center justify-between">
        <span>{maybeT(label)}</span>
        <button
          type="button"
          className="btn btn-circle btn-outline btn-xs"
          onClick={() => fieldArray.append("")}
        >
          <Plus className="mx-1" size={18} />
        </button>
      </legend>
      <div className="flex w-full flex-col space-y-2">
        {fieldArray.fields.map((item, index) => (
          <div className="flex w-full flex-row items-start" key={item.id}>
            <div className="flex-1">
              <FieldsRenderer
                schema={{ [index]: itemSchema }}
                parent={fullName}
                register={register}
                control={control}
                errors={errors}
                setValue={setValue}
              />
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-xs text-error"
              onClick={() => fieldArray.remove(index)}
              aria-label="Remove"
            >
              <Trash size={16} />
            </button>
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default ListField;
