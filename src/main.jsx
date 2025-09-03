import "./polyfills/symbolObservable"
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
import { ApolloProvider } from "@apollo/client";
import { client } from './grapgql'

if (!!!import.meta.env.DEV) {
  Sentry.init({
    // TODO: change Dockerfile
    release: import.meta.env.VITE_APP_VERSION,
    dsn: "https://c02ba70afca842c5ac7997aca99c85b8@sentry.leishi.io/4",
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}

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
