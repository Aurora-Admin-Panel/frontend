import FieldError from "./FieldError";
import { get } from "../../utils/object";
import classNames from "classnames";
import useMaybeT from "../../hooks/useMaybeT";

const SelectField = ({ register, errors, name, label, options = [], rules }) => {
  const maybeT = useMaybeT();
  return (
    <fieldset className="fieldset w-full max-w-xs px-2" key={name}>
      <legend className="fieldset-legend">{maybeT(label)}</legend>
      <select
        className={classNames("select select-bordered w-full", {
          "select-error": !!get(errors, name),
        })}
        {...register(name, rules)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {maybeT(opt.label)}
          </option>
        ))}
      </select>
      <FieldError errors={errors} name={name} />
    </fieldset>
  );
};

export default SelectField;
