import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { gql, useMutation } from "@apollo/client";
import classNames from "classnames";
import { FileTypeEnum } from "../../store/apis/types.generated";
import { hideModal } from "../../store/reducers/modal";
import Error from "../layout/Error"


const UPLOAD_FILE = gql`
  mutation UploadFile($file: Upload!, $name: String!, $type: FileTypeEnum!, $version: String, $notes: String) {
    uploadFile(file: $file, name: $name, type: $type, version: $version, notes: $notes) {
      id
      name
      type
      size
      version
      notes
    }
  }
`;

const FileModal = ({ ...props }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { onCancel, onConfirm } = useSelector((state) => state.modal);
  const [name, setName] = useState(null);
  const [fileType, setFileType] = useState(FileTypeEnum.Secret);
  const [file, setFile] = useState(null);
  const [uploadFile, { loading, error }] = useMutation(UPLOAD_FILE);
  const [version, setVersion] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (file) {
      if (file.type.startsWith("image")) {
        setFileType(FileTypeEnum.Image);
      } else if (file.type.startsWith("video")) {
        setFileType(FileTypeEnum.Video);
      } else if (file.type.startsWith("text")) {
        setFileType(FileTypeEnum.Text);
      } else if (file.type.startsWith("application")) {
        setFileType(FileTypeEnum.Executable);
      }
    }
  }, [file]);
  const handleSubmit = async () => {
    const data = {
      file,
      name: name !== null ? name : file.name,
      type: fileType,
      version: version || null,
      notes: notes || null,
    }
    await uploadFile({ variables: { ...data }});
    if (onConfirm) onConfirm();
    dispatch(hideModal());
  };
  const handleCancel = () => {
    if (onCancel) onCancel();
    dispatch(hideModal());
  };

  if (error) return <Error error={error} />;

  return (
    <div className="modal-box relative">
      <label
        className="btn btn-circle btn-outline btn-sm absolute right-2 top-2"
        onClick={handleCancel}
      >
        ✕
      </label>
      <h3 className="-mt-3 text-lg font-bold">{t("Add File")}</h3>
      <div className="mt-4 flex w-full flex-col space-y-0 px-2">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">
              {t("File Type")}
              {fileType}
            </span>
          </label>
          <select
            className="select select-bordered w-full"
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
          >
            {Object.values(FileTypeEnum).map((val) => (
              <option key={val} value={val}>
                {t(val)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col items-center md:flex-row md:space-x-2">
          <div className="form-control w-1/2">
            <label className="label">
              <span className="label-text">{t("Name")}</span>
            </label>
            <input
              type="text"
              placeholder={t("File Name Placeholder")}
              className="input input-bordered w-full"
              value={name !== null ? name : file !== null ? file.name : ""}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-control w-1/2">
            <label className="label">
              <span className="label-text">{t("Version")}</span>
            </label>
            <input
              type="text"
              placeholder={t("File Version Placeholder")}
              className="input input-bordered w-full"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
            />
          </div>
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">{t("Upload File")}</span>
          </label>
          <input
            type="file"
            className="file-input file-input-bordered file-input-primary mx-auto w-full"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">{t("Notes")}</span>
          </label>
          <textarea
            placeholder={t("File Notes Placeholder")}
            className="textarea textarea-bordered"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-4 flex w-full flex-row justify-end space-x-2 px-2">
        <button className="btn btn-outline btn-primary" onClick={handleCancel}>
          取消
        </button>
        <button
          className={classNames("btn btn-primary", { loading })}
          onClick={handleSubmit}
        >
          添加
        </button>
      </div>
    </div>
  );
};

export default FileModal;
