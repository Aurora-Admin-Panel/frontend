import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import Dropdown from "../ui/dropdown/Dropdown";
import LanguageMenuItems from "./LanguageMenuItems";

const LanguageSwitch = () => {
  const { t } = useTranslation();

  return (
    <Dropdown
      align="end"
      lazyMount
      trigger={
        <div className="indicator">
          <Languages size={20} />
        </div>
      }
      triggerAriaLabel={t("Language switcher")}
      summaryClassName="btn btn-ghost btn-circle bg-base-100/20"
      contentAs="ul"
      contentClassName="mt-3 menu menu-sm rounded-box w-52 bg-base-100 p-2 shadow"
    >
      {({ close }) => <LanguageMenuItems onSelect={close} />}
    </Dropdown>
  );
};

export default LanguageSwitch;
