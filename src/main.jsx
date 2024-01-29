import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import * as Sentry from "@sentry/react";
import { PersistGate } from "redux-persist/integration/react";

import "./index.css";
import App from "./App";
import i18n from "./i18n";
import { ThemeProvider } from "./contexts/ThemeContext";
import { store, persistor } from "./store";
import ThemedSuspense from "./features/ThemedSuspense";
// import { initializeWebSocket } from "./store/websocketManager";
import {
  split,
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient as createWSClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { showNotification } from "./store/reducers/notification";

if (!!!import.meta.env.DEV) {
  Sentry.init({
    // TODO: change Dockerfile
    release: import.meta.env.VITE_REACT_APP_VERSION,
    dsn: "https://c02ba70afca842c5ac7997aca99c85b8@sentry.leishi.io/4",
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      store.dispatch(
        showNotification({
          title: i18n.t("GraphQL error"),
          body: message,
          type: "error",
        })
      )
    );
  if (networkError) {
    store.dispatch(
      showNotification({
        title: i18n.t("Network error"),
        body: networkError.message,
        type: "error",
      })
    )
  }
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([errorLink, split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    new GraphQLWsLink(
      createWSClient({
        url: `ws://${window.location.host}/api/graphql`,
        // url: `ws://192.168.1.14:8888/api/graphql`,
        connectionParams: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      })
    ),
    createUploadLink({
      uri: "/api/graphql",
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    })
  )]),
});
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider>
            <Suspense fallback={<ThemedSuspense />}>
              <App />
            </Suspense>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </ApolloProvider>
  </React.StrictMode>
);
