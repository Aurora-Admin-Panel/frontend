import { useQuery, gql } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import Paginator from "../Paginator";
import FileCard from "./FileCard";
import useQueryParams from "../../hooks/useQueryParams";
import Error from "../layout/Error";
import DataLoading from "../DataLoading";
import { useModal } from "../../atoms/modal"
import { GET_FILES_QUERY } from "../../quries/file";


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

  return (
    <>
      <div className="flex-grow-1 container flex h-16 w-full flex-shrink-0 basis-16 flex-row items-center justify-between px-4 sm:px-8">
        <div className="flex flex-row items-center justify-start">
          <h1 className="text-2xl font-extrabold">{t("Files")}</h1>
          <label
            className="modal-button btn btn-circle btn-primary btn-xs ml-2"
            onClick={async () => {
              const result = await open("file");
              if (result) refetch();
            }}
          >
            <Plus />
          </label>
        </div>
      </div>

      <div className="flex w-full flex-col px-4">
        {loading ? (
          <DataLoading />
        ) : (
          <div className="grid grid-cols-1 gap-4 overflow-x-hidden pb-4 pt-2 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {(data?.paginatedFiles?.items ?? []).map((file) => (
              <FileCard key={file.id} file={file} onUpdate={refetch} />
            ))}
          </div>
        )}
        <Paginator
          isLoading={loading}
          count={data?.paginatedFiles?.count}
          limit={limit}
          offset={offset}
          setLimit={setLimit}
          setOffset={setOffset}
        />
      </div>
    </>
  );
};

export default FileCenter;
