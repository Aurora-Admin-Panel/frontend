import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "phosphor-react";
import classNames from "classnames";

import { clearBanner } from "../store/reducers/banner";

const Banner = ({ action = null }) => {
  const banner = useSelector((state) => state.banner);
  const typeToClass = (type) => {
    switch (type) {
      case "success":
      case "info":
      case "warning":
      case "error":
        return `alert-${type}`;
      default:
        return "";
    }
  };
  const dispatch = useDispatch();
  return (
    <>
      <div
        className={`absolute top-8 right-8 z-50 max-w-md whitespace-pre-wrap ${classNames(
          banner.show ? "block" : "hidden"
        )}`}
      >
        <div
          className={classNames("alert", "shadow-lg", typeToClass(banner.type))}
        >
          <div>
            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> */}
            <div>
              <h3 className="whitespace-pre-wrap font-bold text-primary">
                {banner.title}
              </h3>
              <div className="whitespace-pre-wrap text-xs text-primary-content">
                {banner.body}
              </div>
            </div>
          </div>
        </div>
        {action != null ? (
          <div className="flex-none">
            <button className="btn btn-sm">See</button>
          </div>
        ) : (
          <span
            className="absolute top-0 bottom-0 right-0 px-3 py-3"
            onClick={() => dispatch(clearBanner())}
          >
            <X />
          </span>
        )}
      </div>
    </>
  );
};

export default Banner;
