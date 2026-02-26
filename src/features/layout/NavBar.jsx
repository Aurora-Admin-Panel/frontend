import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { CircleUserRound, Languages, List, Palette } from "lucide-react";
import { useAuthReducer } from "../../atoms/auth";
import { drawerOpenAtom } from "../../atoms/layout";
import Dropdown from "../ui/dropdown/Dropdown";
import DropdownSubmenu from "../ui/dropdown/DropdownSubmenu";
import ThemeMenuItems from "../theme/ThemeMenuItems";
import LanguageMenuItems from "../i18n/LanguageMenuItems";

const NavBar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [, setDrawerOpen] = useAtom(drawerOpenAtom);
  const { logout: logoutAction } = useAuthReducer();

  const logout = () => {
    logoutAction();
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-30 flex h-16 w-full justify-center bg-base-100 bg-opacity-90 text-base-content backdrop-blur transition-all duration-100 border-base-200 border-b">
      <div className="navbar w-full">
        <div className="flex-none">
          <button
            type="button"
            className="btn btn-square btn-ghost drawer-button lg:hidden"
            aria-label={t("Open navigation")}
            onClick={() => setDrawerOpen(true)}
          >
            <List size={24} />
          </button>
        </div>
        <div className="flex-1"></div>
        <div className="flex flex-1 justify-end px-2">
          <div className="flex items-stretch">
            <Dropdown
              align="end"
              lazyMount
              trigger={
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-base-200">
                  <CircleUserRound className="h-6 w-6" aria-hidden="true" />
                </div>
              }
              triggerAriaLabel={t("Account menu")}
              summaryClassName="avatar btn btn-circle btn-ghost"
              contentAs="ul"
              contentClassName="mt-3 menu menu-sm rounded-box w-56 bg-base-100 p-2 shadow"
            >
              {({ close: closeAccountMenu }) => (
                <>
                  <DropdownSubmenu
                    label={t("Theme")}
                    icon={Palette}
                    align="left"
                    menuClassName="max-h-96 overflow-y-auto flex-nowrap"
                    lazyMount
                  >
                    {({ close: closeThemeMenu }) => (
                      <ThemeMenuItems
                        onSelect={() => {
                          closeThemeMenu();
                          closeAccountMenu();
                        }}
                      />
                    )}
                  </DropdownSubmenu>
                  <DropdownSubmenu label={t("Language")} icon={Languages} align="left" lazyMount>
                    {({ close: closeLanguageMenu }) => (
                      <LanguageMenuItems
                        onSelect={() => {
                          closeLanguageMenu();
                          closeAccountMenu();
                        }}
                      />
                    )}
                  </DropdownSubmenu>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        closeAccountMenu();
                        logout();
                      }}
                    >
                      {t("Logout")}
                    </button>
                  </li>
                </>
              )}
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NavBar;
