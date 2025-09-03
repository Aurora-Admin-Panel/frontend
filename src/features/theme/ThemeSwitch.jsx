import { useContext } from "react";

import { Palette } from "lucide-react";
import { ThemeContext } from "../../contexts/ThemeContext";
import themes from "../../utils/themes";

const ThemeSwitch = () => {
    const { setTheme } = useContext(ThemeContext);
    return (
        <div className="dropdown dropdown-end">
            <label
                tabIndex="0"
                className="btn btn-ghost btn-circle label-text bg-base-100/20"
            >
                <Palette size={20} />
            </label>
            <ul
                tabIndex="0"
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box z-10 w-40 h-[70vh] max-h-96 overflow-y-auto flex flex-row"
            >
                {themes.map((t) => (
                    <li key={t} className="w-full">
                        <a
                            key={t}
                            className="overflow-hidden"
                            onClick={() => setTheme(t)}
                        >
                            {t}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default ThemeSwitch;
