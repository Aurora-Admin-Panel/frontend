import { useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronsLeft,
  ChevronsRight
} from "lucide-react"
import classNames from "classnames";
import DataLoading from "./DataLoading";
import Icon from "./Icon";

const LIMIT_OPTIONS = [1, 2, 5, 10, 20, 30, 50];

const Paginator = ({ isLoading, count, limit, offset, setLimit, setOffset, limitOptions=null }) => {
  const countRef = useRef(limit);
  if (count !== undefined) {
    countRef.current = count;
  } else if (!isLoading) {
    countRef.current = limit;
  }
  const currentPage = useMemo(() => {
    return Math.floor(offset / limit);
  }, [offset, limit]);
  const { t } = useTranslation();
  // console.log('count:', count, 'countRef.current:', countRef.current, 'currentPage:', currentPage, 'offset:', offset, 'limit:', limit);
  return (
    <div className="flex w-full flex-row justify-end mx-auto space-x-2 mt-2 mb-8 px-4">
      <div className="flex flex-row items-center justify-center space-x-2">
        <span className="text-xs md:text-sm text-nowrap">{t("total", { count: countRef.current })}</span>
        <select
          className={classNames("select select-xs select-ghost md:select-sm cursor-pointer bg-base-100")}
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
          }}
        >
          {(limitOptions ?? LIMIT_OPTIONS).map((i) => (
            <option key={i} value={i}>
              {t("items per page", { limit: i })}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-row shrink-0 grow-0 items-center space-x-2">
        <button
          className={classNames(
            "btn btn-xs md:btn-sm btn-circle btn-ghost",
            currentPage === 0 ? "btn-disabled" : "cursor-pointer"
          )}
          onClick={() => currentPage > 0 && setOffset(offset - limit >= 0 ? offset - limit : 0)}
        >
          <ChevronsLeft />
        </button>
        <select
          className="select select-xs select-ghost cursor-pointer md:select-sm bg-base-100"
          value={currentPage}
          onChange={(e) => setOffset(Number(e.target.value) * limit)}
        >
          {Array.from(Array(Math.ceil(countRef.current / limit)).keys()).map((i) => (
            <option key={i} value={i}>
              { i + 1 }
            </option>
          ))}
        </select>
        <button
          className={classNames(
            "btn btn-xs md:btn-sm btn-circle btn-ghost",
            currentPage === Math.ceil(countRef.current / limit) - 1
              ? "cursor-not-allowed btn-disabled"
              : "cursor-pointer"
          )}
          onClick={() =>
            currentPage < Math.ceil(countRef.current / limit) - 1 && setOffset(offset + limit)
          }
        >
          <ChevronsRight />
        </button>
      </div>
    </div>
  );
};

const PaginatedList = ({
  children,
  isLoading,
  count,
  limit,
  offset,
  setLimit,
  setOffset,
}) => {
  const countRef = useRef(limit);
  if (count !== undefined) {
    countRef.current = count;
  } else {
    countRef.current = limit;
  }
  return (
    <>
      {isLoading ? <DataLoading /> : children}
      <Paginator
        count={countRef.current}
        limit={limit}
        offset={offset}
        setLimit={setLimit}
        setOffset={setOffset}
      />
    </>
  );
};

export default Paginator;
