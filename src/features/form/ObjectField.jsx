import classNames from "classnames";
import FieldsRenderer from "./FieldsRenderer";
import FieldShell from "./FieldShell";

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
  return (
    <FieldShell
      className={classNames("bg-base-200 px-2", className)}
      label={label}
      key={fullName}
    >
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
    </FieldShell>
  );
};

export default ObjectField;
