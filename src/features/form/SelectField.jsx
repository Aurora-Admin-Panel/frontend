import FieldError from "./FieldError";
import FieldShell from "./FieldShell";
import { get } from "../../utils/object";
import classNames from "classnames";
import useMaybeT from "../../hooks/useMaybeT";

const SelectField = ({ register, errors, name, label, options = [], rules, className }) => {
  const maybeT = useMaybeT();
  return (
    <FieldShell className={classNames("px-2", className)} label={label} key={name}>
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
    </FieldShell>
  );
};

export default SelectField;
