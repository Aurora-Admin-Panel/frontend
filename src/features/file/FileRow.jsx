import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { useMutation } from "@apollo/client";
import { motion } from "framer-motion";
import { getReadableSize } from "../../utils/formatter";
import { useModal } from "../../atoms/modal";
import { downloadFile } from "../../utils/download";
import { DELETE_FILE_MUTATION } from "../../queries/file";
import { useEffect } from "react";
import {
  Image,
  Video,
  FileText,
  Terminal,
  Key,
  File as FileIcon,
  Trash2,
  Eye,
  Download,
  Link as LinkIcon,
} from "lucide-react";

const fileTypeConfig = {
  IMAGE: {
    icon: Image,
    iconBg: "bg-secondary/10 text-secondary",
    label: "IMAGE",
  },
  VIDEO: {
    icon: Video,
    iconBg: "bg-accent/10 text-accent",
    label: "VIDEO",
  },
  TEXT: {
    icon: FileText,
    iconBg: "bg-neutral/10 text-neutral",
    label: "TEXT",
  },
  EXECUTABLE: {
    icon: Terminal,
    iconBg: "bg-info/10 text-info",
    label: "EXECUTABLE",
  },
  SECRET: {
    icon: Key,
    iconBg: "bg-error/10 text-error",
    label: "SECRET",
  },
};

const fallbackConfig = {
  icon: FileIcon,
  iconBg: "bg-base-content/5 text-base-content/60",
  label: "FILE",
};

const FileRow = ({ file, onUpdate, index = 0 }) => {
  const { t } = useTranslation();
  const [deleteFile, { called, error }] = useMutation(DELETE_FILE_MUTATION);
  const { open, confirm } = useModal();

  const config = fileTypeConfig[file.type] || fallbackConfig;
  const IconComponent = config.icon;

  const openInModal = () => {
    open("filePreview", { file });
  };

  const handleClickCancel = async (e) => {
    e.stopPropagation();
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

  const isPreviewable = ["IMAGE", "VIDEO", "TEXT"].includes(file.type);

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.25,
        delay: index * 0.03,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="cursor-pointer hover"
      onClick={handleCheck}
    >
      {/* Type icon */}
      <td className="w-0 pr-0">
        <div
          className={classNames(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            config.iconBg,
          )}
        >
          <IconComponent size={16} />
        </div>
      </td>

      {/* Name + notes */}
      <td>
        <div className="font-semibold">{file.name}</div>
        {file.notes && (
          <div className="max-w-xs truncate text-xs opacity-50">
            {file.notes}
          </div>
        )}
      </td>

      {/* Type */}
      <td>
        <span
          className={classNames(
            "badge badge-sm",
            file.type === "SECRET"
              ? "badge-error badge-outline"
              : "badge-ghost",
          )}
        >
          {t(file.type)}
        </span>
      </td>

      {/* Size */}
      <td className="text-xs tabular-nums opacity-70">
        {getReadableSize(file.size)}
      </td>

      {/* Version */}
      <td className="text-xs opacity-50">{file.version || "-"}</td>

      {/* Updated */}
      <td className="text-xs opacity-50">
        {file.updatedAt
          ? new Date(file.updatedAt).toLocaleString()
          : file.createdAt
            ? new Date(file.createdAt).toLocaleString()
            : "-"}
      </td>

      {/* Actions */}
      <td className="text-right">
        <div className="flex items-center justify-end gap-0.5">
          <button
            type="button"
            className="btn btn-ghost btn-xs opacity-60 hover:opacity-100"
            onClick={handleClickCancel}
            title={t("Delete")}
          >
            <Trash2 size={14} />
          </button>
          {file.type === "EXECUTABLE" && (
            <button
              type="button"
              className="btn btn-ghost btn-xs opacity-60 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                open("binding", { fileId: file.id });
              }}
            >
              <LinkIcon size={14} />
              {t("Bindings")}
            </button>
          )}
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={(e) => {
              e.stopPropagation();
              handleCheck();
            }}
          >
            {isPreviewable ? <Eye size={14} /> : <Download size={14} />}
            {isPreviewable ? t("Preview") : t("Download")}
          </button>
        </div>
      </td>
    </motion.tr>
  );
};

export default FileRow;
