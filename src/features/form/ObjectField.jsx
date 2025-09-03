import classNames from "classnames";
import FieldsRenderer from "./FieldsRenderer";
import useMaybeT from "../../hooks/useMaybeT";

function buildGridContainerClasses(gridCfg) {
  const cols = gridCfg?.cols || {};
  const gap = gridCfg?.gap ?? 2;
  const parts = ["grid", `gap-${gap}`];
  const addCols = (bp, n) => {
    if (!n) return;
    const pref = bp === "base" ? "" : `${bp}:`;
    parts.push(`${pref}grid-cols-${n}`);
  };
  addCols("base", cols.base || 1);
  addCols("sm", cols.sm);
  addCols("md", cols.md || 12);
  addCols("lg", cols.lg);
  addCols("xl", cols.xl);
  addCols("2xl", cols["2xl"]);
  return parts.join(" ");
}

const ObjectField = ({ schema, parent, register, control, errors, setValue, name, label, className }) => {
  const fullName = parent ? `${parent}.${name}` : name;
  const level = parent ? parent.split(".").length + 1 : 1;
  const maybeT = useMaybeT();
  return (
    <fieldset className={classNames("fieldset w-full border border-base-300 rounded-box bg-base-200 p-2", className)} key={fullName}>
      <legend className={classNames("fieldset-legend")}>{maybeT(label)}</legend>
      <div className={classNames(buildGridContainerClasses(schema?.$grid), `pl-${level}`, `pr-${level}`)}>
        <FieldsRenderer
          schema={schema}
          parent={fullName}
          register={register}
          control={control}
          errors={errors}
          setValue={setValue}
        />
      </div>
    </fieldset>
  );
};

export default ObjectField;
