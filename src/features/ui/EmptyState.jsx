import { useTranslation } from "react-i18next";

const EmptyState = ({ message, className = "" }) => {
  const { t } = useTranslation();

  return (
    <div className={`text-sm opacity-60 ${className}`}>
      {t(message)}
    </div>
  );
};

export default EmptyState;
