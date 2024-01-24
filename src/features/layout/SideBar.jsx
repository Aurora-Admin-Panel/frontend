import classNames from "classnames";
import * as Icons from "phosphor-react";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation } from "react-router-dom";
import Icon from "../Icon";

const routes = [
  {
    path: "/app/users",
    icon: "Users",
    name: "User",
    permissions: ["admin"],
  },
  {
    path: "/app/servers",
    icon: "Stack",
    name: "Server",
    permissions: ["admin", "ops", "user"],
  },
  {
    path: "/app/files",
    icon: "FileArrowUp",
    name: "File Center",
    permissions: ["admin", "ops", "user"],
  },
  {
    path: "/app/activity",
    icon: "Activity",
    name: "Activity",
    permissions: ["admin", "ops", "user"],
  },
  {
    path: "/app/settings",
    icon: "Gear",
    name: "Settings",
    permissions: ["admin", "ops", "user"],
  },
  {
    path: "/app/about",
    icon: "At",
    name: "About",
    permissions: ["admin", "ops", "user"],
  },
];

const SideBar = () => {
  const location = useLocation();
  const matchDesktop = window.matchMedia("(min-width: 1024px)").matches;
  const { t, i18n } = useTranslation();
  return (
    <>
      <label htmlFor="drawer" className="drawer-overlay"></label>
      <aside className="w-60 bg-base-100 min-h-full">
        <div className="backgrop-blur sticky top-0 z-20 hidden items-center gap-2 bg-base-100 bg-opacity-90 px-4 py-2 lg:flex">
          <a className="btn btn-ghost text-xl normal-case">
            {t("Aurora Admin Panel")}
          </a>
        </div>
        <ul className="menu-normal menu text-base-content">
          {routes.map(
            (route, i) => (
              // route.routes && route.permissions.includes(permission) ? (
              //     <SidebarSubmenu route={route} key={route.name} />
              // ) : (
              //     route.permissions.includes(permission) ? (
              // <Route path={route.path} exact={route.exact} element={
              <li
                className="w-56"
                key={route.name}
                onClick={() => {
                  if (!matchDesktop)
                    document.getElementById("drawer").click();
                }}
              >
                <NavLink to={route.path} className="pb-3 pt-3">
                  <Icon
                    className="h-5 w-5"
                    aria-hidden="true"
                    icon={route.icon}
                  />
                  <span className="ml-4">{t(route.name)}</span>
                </NavLink>
              </li>
            )
            // ) : null)
          )}
        </ul>
      </aside>
    </>
  );
};

export default SideBar;
