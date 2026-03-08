import { Controller } from "react-hook-form";
import classNames from "classnames";
import FieldError from "./FieldError";
import FieldShell from "./FieldShell";
import { get } from "../../../utils/object";

const TextAreaField = ({ control, errors, name, label, rows = 4, rules, className }) => {
  return (
    <FieldShell className={classNames("px-2", className)} label={label} key={name}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <textarea
            className={classNames("textarea textarea-bordered w-full", {
              "textarea-error": !!get(errors, name),
            })}
            rows={rows}
            {...field}
          />
        )}
      />
      <FieldError errors={errors} name={name} />
    </FieldShell>
  );
};

export default TextAreaField;
