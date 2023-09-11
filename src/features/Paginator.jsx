import { useRef } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import DataLoading from "./DataLoading";

const LIMIT_OPTIONS = [1, 2, 5, 10, 20, 30, 50];

const Paginator = ({ count, limit, offset, setLimit, setOffset, limitOptions=null }) => {
  const countRef = useRef(limit);
  if (count !== undefined) {
    countRef.current = count;
  } else {
    countRef.current = limit;
  }
  const { t } = useTranslation();
  return (
    <div className="flex w-full flex-row justify-between">
      <div className="flex flex-row items-center justify-center">
        <span className="text-xs md:text-md font-medium">{t("total", { count: countRef.current })}</span>
        <select
          className={classNames("select select-xs md:select-md")}
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
      <div className="join">
        <button
          className={classNames(
            "join-item btn btn-xs md:btn-md",
            offset === 0 ? "cursor-not-allowed btn-disabled" : "cursor-pointer"
          )}
          onClick={() => offset > 0 && setOffset(offset - limit >= 0 ? offset - limit : 0)}
        >
          «
        </button>
        <select
          className="join-item select select-xs md:select-md"
          value={offset}
          onChange={(e) => setOffset(Number(e.target.value))}
        >
          {Array.from(Array(Math.ceil(countRef.current / limit)).keys()).map((i) => (
            <option key={i} value={i}>
              {i + 1 }
            </option>
          ))}
        </select>
        <button
          className={classNames(
            "join-item btn btn-xs md:btn-md",
            offset === Math.ceil(countRef.current / limit) - 1
              ? "cursor-not-allowed btn-disabled"
              : "cursor-pointer"
          )}
          onClick={() =>
            offset < Math.ceil(countRef.current / limit) - 1 && setOffset(offset + limit)
          }
        >
          »
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
