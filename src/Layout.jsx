import { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./features/layout/NavBar";
import MainContent from "./features/layout/MainContent";
import SideBar from "./features/layout/SideBar";
import ModalManager from "./features/modal/Modalmanager";
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
    }
  }, [token]);

  return (
    <div className="flex max-h-screen flex-col items-center">
      <ModalManager />
      <NavBar />
      <div className="bg-base-100 drawer drawer-mobile">
        <MainContent>
          <Suspense fallback={<ThemedSuspense />}>
            <Outlet />
          </Suspense>
        </MainContent>
        <SideBar />
      </div>
    </div>
  );
};

export default Layout;
