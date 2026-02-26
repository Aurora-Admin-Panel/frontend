import { Suspense, useEffect } from "react";
import { useAtom } from "jotai";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import NavBar from "./features/layout/NavBar";
import SideBar from "./features/layout/SideBar";
import ThemedSuspense from "./features/ThemedSuspense";
import { initializeWebSocket, closeWebSocket } from "./store/websocketManager";
import { useAuthReducer } from "./atoms/auth";
import { getToken } from "./apis/auth";
import { drawerOpenAtom } from "./atoms/layout";


const Layout = () => {
  const [drawerOpen, setDrawerOpen] = useAtom(drawerOpenAtom);
  const { auth: { token } } = useAuthReducer();
  const { login, logout } = useAuthReducer();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      initializeWebSocket(token);
      getToken(token).then((response) => {
        login(response.data)
      }).catch((error) => {
        if (error.response.status === 401) {
          logout();
          navigate("/login");
        } else {
          console.log(error)
        }
      });
    }
    return () => {
      closeWebSocket();
    };
  }, [token]);

  return (
    <div>
      <div className="drawer bg-base-100 lg:drawer-open">
        <input
          id="drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={drawerOpen}
          onChange={(event) => setDrawerOpen(event.target.checked)}
        />
        <div className="drawer-content">
          <NavBar />
          <Suspense fallback={<ThemedSuspense />}>
            <div className="w-full flex flex-col items-center">
              <div className="container">
                <Outlet />
              </div>
            </div>
          </Suspense>
        </div>
        <div className="drawer-side z-40">
          <SideBar />
        </div>
      </div>
    </div>
  );
};

export default Layout;
