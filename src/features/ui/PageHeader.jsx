import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";

const PageHeader = ({ title, onAdd, children }) => {
  const { t } = useTranslation();

  return (
    <div className="flex-grow-1 container flex h-16 w-full flex-shrink-0 basis-16 flex-row items-center justify-between px-4 sm:px-8">
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center justify-start gap-2">
          {typeof title === "string" ? (
            <h1 className="not-prose text-2xl font-extrabold">{t(title)}</h1>
          ) : (
            title
          )}
          {onAdd && (
            <label
              className="modal-button btn btn-circle btn-primary btn-xs ml-2"
              onClick={onAdd}
            >
              <Plus />
            </label>
          )}
        </div>
        {children && (
          <div className="flex flex-row items-center gap-2">{children}</div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
