import { useQuery, gql } from "@apollo/client";
import Paginator from "../Paginator";
import FileCard from "./FileCard";
import useQueryParams from "../../hooks/useQueryParams";
import Error from "../layout/Error";
import DataLoading from "../DataLoading";
import { useModal } from "../../atoms/modal"
import { GET_FILES_QUERY } from "../../queries/file";
import PageHeader from "../ui/PageHeader";


const FileCenter = () => {
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
      <PageHeader
        title="Files"
        onAdd={async () => {
          const result = await open("file");
          if (result) refetch();
        }}
      />

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
