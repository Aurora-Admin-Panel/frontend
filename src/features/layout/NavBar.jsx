import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom'
import themes from "../../utils/themes";
import { List } from "lucide-react";
import LanguageSwitch from "../i18n/LanguageSwitch"
import ThemeSwitch from "../theme/ThemeSwitch";
import { ThemeContext } from "../../contexts/ThemeContext";
import { useAuthReducer } from "../../atoms/auth";

const NavBar = () => {
  const { setTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { logout: logoutAction } = useAuthReducer();
  const logout = () => {
    logoutAction();
    navigate("/login");
  }
  
  return (
    <div className="sticky top-0 z-30 flex h-16 w-full justify-center bg-base-100 bg-opacity-90 text-base-content backdrop-blur transition-all duration-100 border-base-200 border-b">
      <div className="navbar w-full">
        <div className="flex-none">
          <label
            className="btn btn-square btn-ghost drawer-button lg:hidden"
            htmlFor="drawer"
          >
            <List size={24} />
          </label>
        </div>
        <div className="flex-1"></div>
        <div className="flex flex-1 justify-end px-2">
          <div className="flex items-stretch">
            <ThemeSwitch />
            <LanguageSwitch />
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
                  <a>Settings</a>
                </li>
                <li>
                  <a onClick={logout}>Logout</a>
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
