import { Palette } from "lucide-react";
import { useTranslation } from "react-i18next";
import Dropdown from "../ui/dropdown/Dropdown";
import ThemeMenuItems from "./ThemeMenuItems";

const ThemeSwitch = () => {
  const { t } = useTranslation();

  return (
    <Dropdown
      align="end"
      lazyMount
      trigger={<Palette size={20} />}
      triggerAriaLabel={t("Theme switcher")}
      summaryClassName="btn btn-ghost btn-circle bg-base-100/20"
      contentAs="ul"
      contentClassName="mt-3 menu menu-sm rounded-box max-h-96 w-52 flex-nowrap overflow-y-auto bg-base-100 p-2 shadow"
    >
      {({ close }) => <ThemeMenuItems onSelect={close} />}
    </Dropdown>
  );
};
export default ThemeSwitch;
