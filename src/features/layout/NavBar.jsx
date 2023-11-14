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
        <div className="flex-1"></div>
        <div className="flex flex-1 justify-end px-2">
          <div className="flex items-stretch">
            <details className="dropdown dropdown-end">
              <summary className="avatar btn btn-circle btn-ghost">
                <div className="w-10 rounded-full">
                  <img src="https://picsum.photos/80" />
                </div>
              </summary>
              <ul className="menu-compact menu dropdown-content rounded-box z-[1] mt-3 w-40 bg-base-100 p-2 shadow">
                <li>
                  <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li>
                  <details className="dropdown">
                    <summary>{t("Themes")}</summary>
                    <ul className="dropdown-content rounded-box -left-full top-px z-[2] h-[70vh] max-h-96 w-40 overflow-y-auto bg-base-100 p-2 shadow">
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
                  </details>
                </li>
                <li>
                  <details className="dropdown">
                    <summary>{t("Language")}</summary>
                    <ul className="dropdown-content rounded-box -left-full z-[3] w-40 bg-base-100 p-2 shadow">
                      <li>
                        <a onClick={() => i18n.changeLanguage("en")}>
                          {t("EN")}
                        </a>
                      </li>
                      <li>
                        <a onClick={() => i18n.changeLanguage("zh")}>
                          {t("中文")}
                        </a>
                      </li>
                    </ul>
                  </details>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a>Logout</a>
                </li>
              </ul>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NavBar;
