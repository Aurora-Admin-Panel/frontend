import { Controller } from "react-hook-form";
import classNames from "classnames";
import FieldError from "./FieldError";
import { get } from "../../utils/object";
import useMaybeT from "../../hooks/useMaybeT";

const TextField = ({ control, errors, name, label, type = "text", rules, className }) => {
  const maybeT = useMaybeT();
  return (
    <fieldset className={classNames("fieldset w-full px-2", className)} key={name}>
      <legend className="fieldset-legend">{maybeT(label)}</legend>
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field }) => (
            <input
              className={classNames("input w-full", {
                "input-error": !!get(errors, name),
              })}
              type={type}
              {...field}
            />
          )}
        />
        <FieldError errors={errors} name={name} />
    </fieldset>
  );
};

export default TextField;
