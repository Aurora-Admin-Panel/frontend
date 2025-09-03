import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";


const LanguageSwitch = () => {
    const { t, i18n } = useTranslation();
    return (
        <div className="dropdown dropdown-end">
            <label tabIndex="0" className="btn btn-ghost btn-circle label-text bg-base-100/20">
                <div className="indicator">
                    <Languages size={20} />
                </div>
            </label>
            <ul
                tabIndex="0"
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
                <li>
                    <a onClick={() => i18n.changeLanguage("en")}>
                        {t("English")}
                    </a>
                </li>
                <li>
                    <a onClick={() => i18n.changeLanguage("zh")}>
                        {t("中文")}
                    </a>
                </li>
            </ul>
        </div>
    );
}

export default LanguageSwitch;
