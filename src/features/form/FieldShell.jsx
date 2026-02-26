import classNames from "classnames";
import useMaybeT from "../../hooks/useMaybeT";

const FieldShell = ({ label, className, legendClassName, children }) => {
  const maybeT = useMaybeT();

  return (
    <fieldset
      className={classNames(
        "fieldset w-full rounded-box border border-base-300 bg-base-100 p-3",
        className
      )}
    >
      {label ? (
        <legend className={classNames("fieldset-legend px-1 text-sm", legendClassName)}>
          {maybeT(label)}
        </legend>
      ) : null}
      {children}
    </fieldset>
  );
};

export default FieldShell;
