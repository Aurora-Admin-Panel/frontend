import FieldError from "./FieldError";
import FieldShell from "./FieldShell";
import classNames from "classnames";

const CheckboxField = ({ register, errors, name, label, rules, className }) => {
  return (
    <FieldShell className={classNames("px-2", className)} label={label} key={name}>
      <div className="flex h-full items-center justify-start gap-3">
        <input
          type="checkbox"
          className="toggle toggle-primary toggle-sm"
          {...register(name, rules)}
        />
      </div>
      <FieldError errors={errors} name={name} />
    </FieldShell>
  );
};

export default CheckboxField;
