import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";
import { NavLink } from "react-router-dom";
import { drawerOpenAtom } from "../../atoms/layout";
import { routes } from "../../routes";

const SideBar = () => {
  const { t } = useTranslation();
  const [, setDrawerOpen] = useAtom(drawerOpenAtom);
  const sidebarRoutes = routes.filter((route) => route.nav);

  const handleRouteClick = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <label htmlFor="drawer" className="drawer-overlay"></label>
      <aside className="w-60 bg-base-100 min-h-full border-r border-base-200">
        <div className="backdrop-blur sticky top-0 z-20 hidden items-center gap-2 bg-base-100 bg-opacity-90 px-4 py-2 lg:flex">
          <span className="btn btn-ghost text-xl normal-case">
            {t("Aurora Admin Panel")}
          </span>
        </div>
        <ul className="menu-normal menu text-base-content">
          {sidebarRoutes.map((route) => {
            const Icon = route.icon;
            return (
              <li className="w-56" key={route.key} onClick={handleRouteClick}>
                <NavLink to={route.fullPath} end={route.end} className="pb-3 pt-3">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span className="ml-4">{t(route.labelKey)}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
};

export default SideBar;
