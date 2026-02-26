import { memo, useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import themes from "../../utils/themes";

const ThemeMenuItems = ({ onSelect }) => {
  const { setTheme } = useContext(ThemeContext);

  const selectTheme = (themeName) => {
    setTheme(themeName);
    onSelect?.();
  };

  return (
    <>
      {themes.map((themeName) => {
        return (
          <li key={themeName}>
            <button
              type="button"
              className="w-full truncate text-left"
              onClick={() => selectTheme(themeName)}
              title={themeName}
            >
              {themeName}
            </button>
          </li>
        );
      })}
    </>
  );
};

export default memo(ThemeMenuItems);
