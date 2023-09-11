import { logout } from "./auth";
import i18n from "../../i18n";
import { showBanner, clearBanner } from "./banner";


export const handleError = (dispatch, error) => {
  if (error.response) {
    const response = error.response;
    if (response.status === 500) {
      dispatch(showBanner("Error", "Internal Server Error!", "error"));
    } else if (error.name === "AxiosError") {
      dispatch(showBanner(error.code, error.message, "error"));
    } else if (response.status >= 400 && response.status < 500) {
      if (response.status === 401) {
        dispatch(logout())
        dispatch(showBanner(i18n.t("Error"), i18n.t("auth:login_required"), "error"));
      } else {
        const data = response.data;
        if (typeof data.detail === "string" || data.detail instanceof String) {
          dispatch(showBanner("Error", data.detail, "error"));
        } else if (Array.isArray(data.detail)) {
          dispatch(showBanner(data.detail[0].type, data.detail[0].msg, "error"));
        } else {
          dispatch(showBanner("Error", JSON.stringify(response), "error"));
        }
      }
    } else {
      dispatch(showBanner("Error", JSON.stringify(response), "error")
      );
    }
  } else {
    dispatch(showBanner("Error", error.toString(), "error")
    );
  }
};
