import classNames from "classnames";
import FieldsRenderer from "./FieldsRenderer";
import useMaybeT from "../../hooks/useMaybeT";

const ObjectField = ({ schema, parent, register, control, errors, setValue, name, label }) => {
  const fullName = parent ? `${parent}.${name}` : name;
  const level = parent ? parent.split(".").length + 1 : 1;
  const maybeT = useMaybeT();
  return (
    <fieldset className="fieldset w-full max-w-xs border border-base-300 rounded-box bg-base-200 p-2" key={fullName}>
      <legend className={classNames("fieldset-legend")}>{maybeT(label)}</legend>
      <div className={classNames("flex w-full flex-col space-y-2", `pl-${level}`, `pr-${level}`)}>
        <FieldsRenderer
          schema={schema}
          parent={fullName}
          register={register}
          control={control}
          errors={errors}
          setValue={setValue}
        />
      </div>
    </fieldset>
  );
};

export default ObjectField;
