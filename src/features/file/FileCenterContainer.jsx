import { Outlet, useLocation, useNavigate, matchPath } from "react-router-dom";


const FileCenterContainer = () => {
  const location = useLocation()
  const navigate = useNavigate()


  return (
      <Outlet />
  );
};

export default FileCenterContainer;
