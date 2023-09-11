import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { gql, useMutation } from "@apollo/client";
import { getReadableSize } from "../../utils/formatter";
import { showModal } from "../../store/reducers/modal";
import { useEffect } from "react";

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

const FileCard = ({ file, onUpdate }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [deleteFile, { called, error }] =
    useMutation(DELETE_FILE);
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
    <div className="card indicator h-32 w-64 justify-self-center bg-base-100 shadow-xl">
      {file.version && (
        <span className="badge indicator-item badge-sm border-base-300 bg-base-200 text-base-content">
          {file.version}
        </span>
      )}
      <div className="card-body px-6 py-4">
        <div className="tooltip tooltip-bottom" data-tip={file.name}>
          <h2 className="card-title h-8 truncate">{file.name}</h2>
        </div>
        <div className="flex space-x-2">
          <div className={classNames("badge", fileTypeToBadge(file.type))}>
            {t(file.type)}
          </div>
          <div className="badge badge-outline">
            {getReadableSize(file.size)}
          </div>
        </div>
        <div className="card-actions justify-end">
          <button
            className="btn btn-outline btn-error btn-xs"
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
