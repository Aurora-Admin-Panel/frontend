import Dropdown from "./Dropdown";

const DropdownSubmenu = ({
  label,
  children,
  icon: Icon,
  align = "left",
  className = "",
  menuClassName = "",
  lazyMount = true,
}) => {
  return (
    <li className={`relative ${className}`.trim()}>
      <Dropdown
        align={align}
        className="w-full !overflow-visible"
        summaryClassName="group relative flex w-full cursor-pointer items-center justify-between rounded-btn px-4 py-2 text-sm hover:bg-base-200"
        contentAs="ul"
        contentClassName={`top-0 mt-0 menu menu-sm rounded-box min-w-52 bg-base-100 p-2 shadow ${menuClassName}`.trim()}
        lazyMount={lazyMount}
        trigger={
          <>
            <span className="flex items-center gap-2">
              {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
              <span>{label}</span>
            </span>
            <span
              aria-hidden="true"
              className={`absolute top-0 h-full w-4 ${
                align === "left" ? "-left-4" : "-right-4"
              }`}
            />
          </>
        }
      >
        {children}
      </Dropdown>
    </li>
  );
};

export default DropdownSubmenu;
