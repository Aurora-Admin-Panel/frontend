import { useEffect, useState } from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import DataLoading from "../DataLoading";
import { downloadFile } from "../../utils/download";
import { useModalReducer } from "../../atoms/modal";

const FilePreviewModal = () => {
  const { t } = useTranslation();
  const {
    modal: { modalProps },
    hideModal,
  } = useModalReducer();
  const file = modalProps?.file;

  const [textContent, setTextContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchText = async () => {
      if (!file || file.type !== "TEXT") return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(file.path);
        if (!res.ok) throw new Error(`Failed to load file: ${res.status}`);
        const txt = await res.text();
        setTextContent(txt);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    fetchText();
  }, [file]);

  if (!file) return null;

  const renderContent = () => {
    switch (file.type) {
      case "IMAGE":
        return (
          <div className="flex items-center justify-center">
            <img
              src={file.path}
              alt={file.name}
              className="max-h-[70vh] w-auto object-contain rounded-md"
            />
          </div>
        );
      case "VIDEO":
        return (
          <div className="flex items-center justify-center">
            <video
              src={file.path}
              controls
              className="max-h-[70vh] w-full rounded-md"
            />
          </div>
        );
      case "TEXT":
        return (
          <div className="max-h-[70vh] overflow-auto rounded-md border border-base-300 bg-base-200 p-3">
            {loading ? (
              <DataLoading />
            ) : error ? (
              <div className="text-error text-sm">{String(error)}</div>
            ) : (
              <pre className="whitespace-pre-wrap break-words text-xs">
                {textContent}
              </pre>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal-box relative">
      <label
        className="btn btn-circle btn-outline btn-sm absolute right-2 top-2"
        onClick={hideModal}
      >
        ✕
      </label>
      <h3 className="-mt-3 text-lg font-bold">{file.name}</h3>
      <div className="mt-4 flex w-full flex-col space-y-3 px-2">
        {renderContent()}
      </div>
      <div className="mt-4 flex w-full flex-row justify-end space-x-2 px-2">
        <button className="btn btn-outline btn-accent" onClick={hideModal}>
          {t("Close")}
        </button>
        <a className="btn btn-primary" href={file.path} download={file.name} onClick={(e) => { e.preventDefault(); downloadFile(file.path, file.name); }}>
          {t("Download")}
        </a>
      </div>
    </div>
  );
};

export default FilePreviewModal;
