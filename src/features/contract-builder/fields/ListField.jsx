import { useFieldArray } from "react-hook-form";
import { Plus, Trash } from "lucide-react";
import FieldsRenderer from "./FieldsRenderer";
import FieldShell from "./FieldShell";
import classNames from "classnames";

const ListField = ({ name, label, itemSchema, parent, register, control, errors, setValue, className }) => {
  const fullName = parent ? `${parent}.${name}` : name;
  const fieldArray = useFieldArray({ control, name: fullName });

  return (
    <FieldShell className={classNames("px-2", className)} label={label} key={fullName}>
      <div className="mb-2 flex justify-end">
        <button
          type="button"
          className="btn btn-circle btn-outline btn-xs"
          onClick={() => fieldArray.append("")}
        >
          <Plus className="mx-1" size={18} />
        </button>
      </div>
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
    </FieldShell>
  );
};

export default ListField;
