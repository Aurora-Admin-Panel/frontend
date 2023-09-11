import { Outlet, useLocation, useNavigate, matchPath } from "react-router-dom";
import ServerList from "./ServerList";


const ServerContainer = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const match = matchPath({ path: "/app/servers/:serverId", exact: true }, location.pathname)
  if (match) {
    const { serverId } = match.params
    navigate(`/app/servers/${serverId}/ports`, { replace: true })
  }

  return (
    <>
      {matchPath({ path: "/app/servers", exact: true }, location.pathname) ? <ServerList /> : <Outlet />}
    </>
  );
};

export default ServerContainer;
