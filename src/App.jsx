import { lazy } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ThemedSuspense from "./features/ThemedSuspense";
import { routes } from "./routes";

const ModalManager = lazy(() => import("./features/modal/ModalManager"));
const Notification = lazy(() => import("./features/Notification"));
const Layout = lazy(() => import("./Layout"));
const Login = lazy(() => import("./features/auth/Login"));
const CreateAccount = lazy(() => import("./features/auth/CreateAccoount"));
const ServerContainer = lazy(() => import("./features/server/ServerContainer"));
const ServerPorts = lazy(() => import("./features/port/ServerPorts"));
const ServerUsers = lazy(() => import("./features/user/ServerUsers"));
const Form = lazy(() => import("./features/form/DynamicForm"));
const ExecutableContractSchemas = lazy(() =>
  import("./features/form/ExecutableContractSchemas")
);
const Users = lazy(() => import("./features/user/Users"));
const FileCenterContainer = lazy(() => import("./features/file/FileCenterContainer"));
const FileCenter = lazy(() => import("./features/file/FileCenter"));
const About = lazy(() => import("./features/about/About"));
const Themes = lazy(() => import("./features/layout/Themes"));
const NoMatch = lazy(() => import("./features/layout/NoMatch"));

const App = () => {
  const { t } = useTranslation();
  const routeMap = Object.fromEntries(routes.map((route) => [route.key, route]));

  return (
    <Router>
      <Helmet>
        <title>{t("Aurora Admin Panel")}</title>
      </Helmet>
      <ModalManager />
      <Notification />
      <Routes>
        <Route path={routeMap.login.path} element={<Login />} />
        <Route path={routeMap.createAccount.path} element={<CreateAccount />} />
        <Route path="test" element={<ThemedSuspense />} />
        <Route path={routeMap.app.path} element={<Layout />}>
          <Route index element={<Navigate to={routeMap.servers.fullPath} replace />} />
          <Route path={routeMap.servers.path} element={<ServerContainer />}>
            <Route path={routeMap.serverId.path} />
            <Route path={routeMap.serverPorts.path} element={<ServerPorts />} />
            <Route path={routeMap.serverUsers.path} element={<ServerUsers />} />
          </Route>
          <Route path={routeMap.users.path} element={<Users />} />
          <Route path={routeMap.files.path} element={<FileCenterContainer />}>
            <Route index element={<FileCenter />} />
          </Route>
          <Route path={routeMap.about.path} element={<About />} />
          <Route path={routeMap.contracts.path} element={<ExecutableContractSchemas />} />
          <Route path={routeMap.contractBuilder.path} element={<Form />} />
          <Route path={routeMap.contractBuilderById.path} element={<Form />} />
          <Route
            path={routeMap.formRedirect.path}
            element={<Navigate to={routeMap.contractBuilder.fullPath} replace />}
          />
          <Route path={routeMap.themes.path} element={<Themes />} />
          <Route path="*" element={<NoMatch />} />
        </Route>

        {/* Place new routes over this */}
        {/* <Route path="/app/*" element={<Layout />} /> */}
        <Route
          path={routeMap.root.path}
          element={<Navigate to={routeMap.login.fullPath} replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;
