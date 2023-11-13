import React, { lazy, Suspense } from "react";
import ReactLoading from "react-loading";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ThemedSuspense from "./features/ThemedSuspense";

const ModalManager = lazy(() => import("./features/modal/ModalManager"));
const Banner = lazy(() => import("./features/Banner"));
const Notification = lazy(() => import("./features/Notification"));
const Layout = lazy(() => import("./Layout"));
const Login = lazy(() => import("./features/auth/Login"));
const CreateAccount = lazy(() => import("./features/auth/CreateAccoount"));
const ServerContainer = lazy(() => import("./features/server/ServerContainer"));
const ServerPorts = lazy(() => import("./features/port/ServerPorts"));
const ServerUsers = lazy(() => import("./features/user/ServerUsers"));
const Users = lazy(() => import("./features/user/Users"));
const FileCenterContainer = lazy(() => import("./features/file/FileCenterContainer"));
const FileCenter = lazy(() => import("./features/file/FileCenter"));
const About = lazy(() => import("./features/about/About"));
const Themes = lazy(() => import("./features/layout/Themes"));
const NoMatch = lazy(() => import("./features/layout/NoMatch"));

const App = () => {
  return (
    <Router>
      <Banner />
      <ModalManager />
      <Notification />
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="create-account" element={<CreateAccount />} />
        <Route path="test" element={<ThemedSuspense />} />
        <Route path="app" element={<Layout />}>
          <Route index element={<Navigate to="/app/servers" replace />} />
          <Route path="servers" element={<ServerContainer />}>
            <Route path=":serverId" />
            <Route path=":serverId/ports" element={<ServerPorts />} />
            <Route path=":serverId/users" element={<ServerUsers />} />
          </Route>
          <Route path="users" element={<Users />} />
          <Route path="files" element={<FileCenterContainer />}>
            <Route index element={<FileCenter />}/>
          </Route>
          <Route path="about" element={<About />} />
          <Route path="themes" element={<Themes />} />
          <Route path="*" element={<NoMatch />} />
        </Route>

        {/* Place new routes over this */}
        {/* <Route path="/app/*" element={<Layout />} /> */}
        <Route index path="/" exact element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
