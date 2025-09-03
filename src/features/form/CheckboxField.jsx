import FieldError from "./FieldError";
import useMaybeT from "../../hooks/useMaybeT";
import classNames from "classnames";

const CheckboxField = ({ register, errors, name, label, rules, className }) => {
  const maybeT = useMaybeT();
  return (
    <fieldset className={classNames("fieldset w-full px-2", className)} key={name}>
      <legend className="fieldset-legend flex items-center justify-between">
        <span>{maybeT(label)}</span>
        <input type="checkbox" className="checkbox" {...register(name, rules)} />
      </legend>
      <FieldError errors={errors} name={name} />
    </fieldset>
  );
};

export default CheckboxField;
