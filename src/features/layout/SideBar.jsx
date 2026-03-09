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
      <aside className="flex w-60 flex-col bg-base-200 min-h-full">
        <div className="sticky top-0 z-20 hidden px-6 py-5 lg:block">
          <span className="text-lg font-black tracking-tight">Aurora</span>
        </div>

        <nav className="flex-1 px-3 py-2">
          <ul className="space-y-0.5">
            {sidebarRoutes.map((route) => {
              const Icon = route.icon;
              return (
                <li key={route.key} onClick={handleRouteClick}>
                  <NavLink
                    to={route.fullPath}
                    end={route.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-base-content/60 hover:bg-base-content/5 hover:text-base-content"
                      }`
                    }
                  >
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    <span>{t(route.labelKey)}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default SideBar;
