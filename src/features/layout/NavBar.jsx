import { useContext } from "react";
import { useTranslation } from "react-i18next";
import themes from "../../utils/themes";
import Icon from "../Icon";
import { ThemeContext } from "../../contexts/ThemeContext";

const NavBar = () => {
  const { setTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  return (
    <div className="sticky top-0 z-30 flex h-16 w-full justify-center bg-base-100 bg-opacity-90 text-base-content backdrop-blur transition-all duration-100">
      <div className="navbar w-full">
        <div className="flex-none">
          <label
            className="btn btn-square btn-ghost drawer-button lg:hidden"
            htmlFor="drawer"
          >
            <Icon icon="List" size={24} />
          </label>
        </div>
        <div className="flex-1">
        </div>
        <div className="flex flex-1 justify-end px-2">
          <div className="flex items-stretch">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="avatar btn btn-circle btn-ghost">
                <div className="w-10 rounded-full">
                  <img src="https://picsum.photos/80" />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu-compact menu dropdown-content z-[1] rounded-box mt-3 w-40 bg-base-100 p-2 shadow"
              >
                <li>
                  <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li className="dropdown">
                  <span tabIndex={1}>{t("Themes")}</span>
                  <ul className="dropdown-content rounded-box -left-full top-px h-[70vh] max-h-96 w-40 overflow-y-auto bg-base-100 p-2 shadow">
                    {themes.map((t) => (
                      <li key={t}>
                        <button
                          key={t}
                          className="overflow-hidden"
                          onClick={() => setTheme(t)}
                        >
                          {t}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="dropdown">
                  <span tabIndex={2}>{t("Language")}</span>
                  <ul className="dropdown-content rounded-box -left-full w-40 bg-base-100 p-2 shadow">
                    <li>
                      <a onClick={() => i18n.changeLanguage("en")}>{t("EN")}</a>
                    </li>
                    <li>
                      <a onClick={() => i18n.changeLanguage("zh")}>
                        {t("中文")}
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NavBar;
