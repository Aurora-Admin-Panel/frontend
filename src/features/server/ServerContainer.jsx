import { Outlet, useLocation, matchPath } from "react-router-dom";
import ServerList from "./ServerList";


const ServerContainer = () => {
  const location = useLocation();

  return (
    <>
      {matchPath({ path: "/app/servers", exact: true }, location.pathname) ? <ServerList /> : <Outlet />}
    </>
  );
};

export default ServerContainer;
