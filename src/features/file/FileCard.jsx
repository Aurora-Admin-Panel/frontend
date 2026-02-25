import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { gql, useMutation } from "@apollo/client";
import { getReadableSize } from "../../utils/formatter";
import { useModal } from "../../atoms/modal"
import { downloadFile } from "../../utils/download";
import { DELETE_FILE_MUTATION } from "../../quries/file";
import { useEffect } from "react";
import { Image, Video, FileText, Terminal, Key, File as FileIcon } from "lucide-react";


const fileTypeToBadge = (type) => {
  switch (type) {
    case "IMAGE":
      return "badge-secondary";
    case "VIDEO":
      return "badge-accent";
    case "TEXT":
      return "badge-neutral";
    case "EXECUTABLE":
      return "badge-info";
    case "SECRET":
      return "badge-error";
    default:
      return "badge-secondary";
  }
};

const fileTypeToIcon = (type) => {
  switch (type) {
    case "IMAGE":
      return <Image />;
    case "VIDEO":
      return <Video />;
    case "TEXT":
      return <FileText />;
    case "EXECUTABLE":
      return <Terminal />;
    case "SECRET":
      return <Key />;
    default:
      return <FileIcon />;
  }
};

const FileCard = ({ file, onUpdate }) => {
  const { t } = useTranslation();
  const [deleteFile, { called, error }] = useMutation(DELETE_FILE_MUTATION);
  const { open, confirm } = useModal();
  const openInModal = () => {
    open("filePreview", { file });
  };


  const handleClickCancel = async () => {
      const confirmed = await confirm({
          title: t("Delete File"),
          message: t("Are you sure you want to delete this file", {
            name: file.name,
          }),
        });
      if (confirmed) {
        deleteFile({ variables: { id: file.id } });
      }
  };
  const handleCheck = () => {
    switch (file.type) {
      case "IMAGE":
      case "VIDEO":
      case "TEXT":
        return openInModal();
      case "EXECUTABLE":
      case "SECRET":
      default:
        return downloadFile(file.path, file.name);
    }
  };

  useEffect(() => {
    if (called || error) {
      onUpdate();
    }
  }, [called, error]);

  return (
    <div className="card indicator h-32 w-full min-w-0 bg-base-300 shadow-md">
      {file.version && (
        <span className="badge indicator-item badge-sm border-base-300 bg-base-200 text-base-content">
          {file.version}
        </span>
      )}
      <div className="card-body gap-2 px-4 py-4">
        <div className="tooltip tooltip-bottom" data-tip={file.name}>
          <h2 className="text-md card-title h-4 justify-start">
            <p className="truncate flex-grow-0">{file.name}</p>
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex flex-row items-center text-xs text-secondary">
            <div className="mr-1 flex flex-row items-center">
              {fileTypeToIcon(file.type)}
            </div>
            {t(file.type)}
          </div>
          <div className="text-xs">{getReadableSize(file.size)}</div>
        </div>
        {file.notes ? (
          <div className="tooltip tooltip-bottom" data-tip={file.notes}>
            <div className="flex items-start truncate text-xs text-primary">
              {file.notes}
            </div>
          </div>
        ) : (
          <div className="h-4"></div>
        )}
        <div className="card-actions justify-end">
          <button
            className="btn btn-error btn-outline btn-xs"
            onClick={handleClickCancel}
          >
            {t("Delete")}
          </button>
          <button className="btn btn-primary btn-xs" onClick={handleCheck}>{t("Check")}</button>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
