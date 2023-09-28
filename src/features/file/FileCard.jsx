import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { gql, useMutation } from "@apollo/client";
import { getReadableSize } from "../../utils/formatter";
import { showModal } from "../../store/reducers/modal";
import { useEffect } from "react";
import Icon from "../Icon";

const DELETE_FILE = gql`
  mutation DeleteFile($id: Int!) {
    deleteFile(id: $id)
  }
`;

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
      return <Icon icon="Image" />;
    case "VIDEO":
      return <Icon icon="VideoCamera" />;
    case "TEXT":
      return <Icon icon="FileText" />;
    case "EXECUTABLE":
      return <Icon icon="Terminal" />;
    case "SECRET":
      return <Icon icon="Key" />;
    default:
      return <Icon icon="File" />;
  }
};

const FileCard = ({ file, onUpdate }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [deleteFile, { called, error }] = useMutation(DELETE_FILE);
  const handleClickCancel = () => {
    dispatch(
      showModal({
        modalType: "confirmation",
        modalProps: {
          title: t("Delete File"),
          message: t("Are you sure you want to delete this file", {
            name: file.name,
          }),
        },
        onConfirm: () => deleteFile({ variables: { id: file.id } }),
      })
    );
  };

  useEffect(() => {
    if (called || error) {
      onUpdate();
    }
  }, [called, error]);

  return (
    <div className="card indicator h-32 w-48 justify-self-center bg-base-100 shadow-xl">
      {file.version && (
        <span className="badge indicator-item badge-sm border-base-300 bg-base-200 text-base-content">
          {file.version}
        </span>
      )}
      <div className="card-body gap-2 px-4 py-4">
        <div className="tooltip tooltip-bottom" data-tip={file.name}>
          <h2 className="text-md card-title h-6 justify-start">
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
          <button className="btn btn-primary btn-xs">{t("Check")}</button>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
