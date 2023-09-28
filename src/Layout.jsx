import { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./features/layout/NavBar";
import SideBar from "./features/layout/SideBar";
import ThemedSuspense from "./features/ThemedSuspense";
import { initializeWebSocket, closeWebSocket } from "./store/websocketManager";
import { useSelector } from "react-redux";


const Layout = () => {
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      initializeWebSocket(token);
    }
    return () => {
      closeWebSocket();
    };
  }, [token]);

  return (
    <div>
      <div className="drawer bg-base-100 lg:drawer-open">
        <input id="drawer" type="checkbox" className="drawer-toggle" />
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
