import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";

const ServerUsers = () => {
  const { serverId } = useParams();
  const { t, i18n } = useTranslation();
  return (
    <>
      {/* <AddServerModal /> */}
      <div className="flex flex-col w-full h-full px-2">
        <div className="flex flex-row flex-grow-1 flex-shrink-0 basis-16 justify-between items-center w-full h-16 px-4 sm:px-8">
          <div className="flex flex-row justify-start items-center">
            <h1 className="text-2xl font-extrabold">{t("ServerUsers")}-{serverId}</h1>
            <label
              className="btn btn-primary btn-xs btn-circle ml-2 modal-button"
              htmlFor="server-edit-modal"
            >
            <Plus />
            </label>
          </div>
          <div className="flex flex-col ssm:flex-row items-center">
            <select className="select select-xs md:select-md select-ghost">
              <option>10</option>
              <option>20</option>
              <option>30</option>
              <option>50</option>
            </select>
            <select className="select select-xs md:select-md select-bordered">
              <option>第1页</option>
              <option>第2页</option>
              <option>第3页</option>
              <option>第4页</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col flex-auto items-center space-y-3 px-2 pt-2 pb-10 max-h-screen overflow-y-auto bg-primary">
        </div>
      </div>
    </>
  );
};

export default ServerUsers;
