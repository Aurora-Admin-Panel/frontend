import FieldError from "./FieldError";
import useMaybeT from "../../hooks/useMaybeT";

const CheckboxField = ({ register, errors, name, label, rules }) => {
  const maybeT = useMaybeT();
  return (
    <fieldset className="fieldset w-full max-w-xs px-2" key={name}>
      <legend className="fieldset-legend flex items-center justify-between">
        <span>{maybeT(label)}</span>
        <input type="checkbox" className="checkbox" {...register(name, rules)} />
      </legend>
      <FieldError errors={errors} name={name} />
    </fieldset>
  );
};

export default CheckboxField;
