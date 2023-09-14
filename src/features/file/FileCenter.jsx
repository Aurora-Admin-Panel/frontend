import { useDispatch } from "react-redux";
import { useQuery, gql } from "@apollo/client";
import { useTranslation } from "react-i18next";
import Icon from "../Icon";
import Paginator from "../Paginator";
import { showModal } from "../../store/reducers/modal";
import FileCard from "./FileCard";
import useQueryParams from "../../hooks/useQueryParams";
import Error from "../layout/Error";
import DataLoading from "../DataLoading";

const GET_FILES = gql`
  query GetFiles($limit: Int, $offset: Int) {
    paginatedFiles(limit: $limit, offset: $offset) {
      items {
        id
        name
        type
        size
        version
        notes
        createdAt
        updatedAt
      }
      count
    }
  }
`;

const FileCenter = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
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
  // const { data, isLoading, error, refetch } = useGetFilesQuery({
  //   limit,
  //   offset,
  // });
  const { loading, error, data, refetch } = useQuery(GET_FILES, {
    variables: { limit, offset },
  });

  if (error) return <Error error={error} />;
  return (
    <>
      <div className="flex-grow-1 container flex h-16 w-full flex-shrink-0 basis-16 flex-row items-center justify-between px-4 sm:px-8">
        <div className="flex flex-row items-center justify-start">
          <h1 className="text-2xl font-extrabold">{t("Files")}</h1>
          <label
            className="modal-button btn btn-circle btn-primary btn-xs ml-2"
            onClick={() =>
              dispatch(
                showModal({
                  modalType: "file",
                  onConfirm: refetch,
                })
              )
            }
          >
            <Icon icon="Plus" />
          </label>
        </div>
      </div>

      <div className="flex w-full flex-col">
        {loading ? (
          <DataLoading />
        ) : (
          <div className="flex flex-row flex-wrap pt-2 pb-4">
            {(data?.paginatedFiles?.items ?? []).map((file) => (
              <div className="flex flex-col w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6 py-2 items-center" key={file.id}>
                <FileCard key={file.id} file={file} onUpdate={refetch} />

              </div>
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
