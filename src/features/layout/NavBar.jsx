import { useContext } from "react";
import { useTranslation } from "react-i18next";
import themes from "../../utils/themes";
import { ThemeContext } from "../../contexts/ThemeContext";

const NavBar = () => {
  const { setTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  return (
    <div className="navbar flex flex-grow-0 flex-shrink-0 basis-16 justify-end items-center bg-base-100">
      <div className="flex-none">
        <label
          className="btn btn-square btn-ghost drawer-button lg:hidden"
          htmlFor="my-drawer-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-5 h-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </label>
      </div>
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">{t('Aurora Admin Panel')}</a>
      </div>
      <div className="flex justify-end flex-1 px-2">
        <div className="flex items-stretch">
          <div className="dropdown dropdown-end">
            <label tabIndex="0" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src="https://placeimg.com/80/80/people" />
              </div>
            </label>
            <ul
              tabIndex="0"
              className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-40"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li tabIndex="0">
                <span>{t('Themes')}</span>
                <ul className="rounded-box shadow dropdown-content top-px max-h-96 h-[70vh] overflow-y-auto p-2 bg-base-100 -left-full w-40">
                  {themes.map((t) => (
                    <li key={t} >
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
              <li tabIndex="0">
                <span>{t('Language')}</span>
                <ul className="rounded-box shadow dropdown-content p-2 bg-base-100 -left-full w-40">
                  <li><a onClick={() => i18n.changeLanguage('en')}>{t('EN')}</a></li>
                  <li><a onClick={() => i18n.changeLanguage('zh')}>{t('中文')}</a></li>
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
  );
};
export default NavBar;
