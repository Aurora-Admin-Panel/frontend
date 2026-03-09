import { useQuery } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";
import { Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import Paginator from "../Paginator";
import FileRow from "./FileRow";
import useQueryParams from "../../hooks/useQueryParams";
import DataLoading from "../DataLoading";
import { useModal } from "../../atoms/modal";
import { GET_FILES_QUERY } from "../../queries/file";
import PageHeader from "../ui/PageHeader";

const FileEmptyState = ({ onAdd }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col items-center justify-center py-24"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/8">
        <Upload size={28} className="text-primary/50" />
      </div>
      <h2 className="mt-5 text-lg font-bold tracking-tight">
        {t("No files yet")}
      </h2>
      <p className="mt-1.5 max-w-xs text-center text-sm opacity-40">
        {t("Upload configuration files, binaries, certificates, and secrets to deploy across your servers.")}
      </p>
      <button
        className="btn btn-primary btn-sm mt-6 gap-2"
        onClick={onAdd}
      >
        <Upload size={15} />
        {t("Upload File")}
      </button>
    </motion.div>
  );
};

const FileCenter = () => {
  const { t } = useTranslation();
  const { open } = useModal();
  const [limit, offset, setLimit, setOffset] = useQueryParams([
    {
      name: "limit",
      defaultValue: 20,
      isNumeric: true,
      replace: false,
    },
    {
      name: "offset",
      defaultValue: 0,
      isNumeric: true,
      replace: false,
    },
  ]);
  const { loading, data, refetch } = useQuery(GET_FILES_QUERY, {
    variables: { limit, offset },
  });

  const handleAdd = async () => {
    const result = await open("file");
    if (result) refetch();
  };

  const files = data?.paginatedFiles?.items ?? [];
  const count = data?.paginatedFiles?.count ?? 0;
  const isEmpty = !loading && files.length === 0;

  return (
    <>
      <PageHeader title="Files" onAdd={handleAdd} />

      <div className="flex w-full flex-col px-4">
        {loading ? (
          <DataLoading />
        ) : isEmpty ? (
          <FileEmptyState onAdd={handleAdd} />
        ) : (
          <div className="card bg-base-200 shadow-md">
            <div className="card-body p-0">
              <div className="overflow-x-auto">
                <AnimatePresence mode="wait">
                  <motion.table
                    key={`page-${offset}`}
                    className="table"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <thead>
                      <tr>
                        <th className="w-0" />
                        <th>{t("Name")}</th>
                        <th>{t("Type")}</th>
                        <th>{t("Size")}</th>
                        <th>{t("Version")}</th>
                        <th>{t("Updated")}</th>
                        <th className="text-right">{t("Actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {files.map((file, i) => (
                        <FileRow
                          key={file.id}
                          file={file}
                          onUpdate={refetch}
                          index={i}
                        />
                      ))}
                    </tbody>
                  </motion.table>
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
        {!isEmpty && (
          <Paginator
            isLoading={loading}
            count={count}
            limit={limit}
            offset={offset}
            setLimit={setLimit}
            setOffset={setOffset}
          />
        )}
      </div>
    </>
  );
};

export default FileCenter;
