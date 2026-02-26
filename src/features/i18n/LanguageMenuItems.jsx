import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";

const LANGUAGES = [
  { code: "en", labelKey: "English" },
  { code: "zh", labelKey: "中文" },
];

const LanguageMenuItems = ({ onSelect }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    onSelect?.();
  };

  return (
    <>
      {LANGUAGES.map((language) => {
        const isActive = i18n.resolvedLanguage === language.code || i18n.language?.startsWith(`${language.code}-`);
        return (
          <li key={language.code}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-2 text-left"
              onClick={() => changeLanguage(language.code)}
            >
              <span>{t(language.labelKey)}</span>
              {isActive ? <Check className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
            </button>
          </li>
        );
      })}
    </>
  );
};

export default memo(LanguageMenuItems);
