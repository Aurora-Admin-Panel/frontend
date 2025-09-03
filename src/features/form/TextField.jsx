import { Controller } from "react-hook-form";
import classNames from "classnames";
import FieldError from "./FieldError";
import { get } from "../../utils/object";
import useMaybeT from "../../hooks/useMaybeT";

const TextField = ({ control, errors, name, label, type = "text", rules }) => {
  const maybeT = useMaybeT();
  return (
    <fieldset className="fieldset w-full max-w-xs px-2" key={name}>
      <legend className="fieldset-legend">{maybeT(label)}</legend>
      {/* <label className="input"> */}
        {/* <span className="label">https://</span> */}
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
      {/* </label> */}
    </fieldset>
  );
};

export default TextField;
