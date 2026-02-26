import { Controller } from "react-hook-form";
import classNames from "classnames";
import FieldError from "./FieldError";
import FieldShell from "./FieldShell";
import { get } from "../../utils/object";

const TextField = ({ control, errors, name, label, type = "text", rules, className }) => {
  return (
    <FieldShell className={classNames("px-2", className)} label={label} key={name}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <input
            className={classNames("input input-bordered w-full", {
              "input-error": !!get(errors, name),
            })}
            type={type}
            {...field}
          />
        )}
      />
      <FieldError errors={errors} name={name} />
    </FieldShell>
  );
};

export default TextField;
