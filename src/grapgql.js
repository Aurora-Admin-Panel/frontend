import i18n from "./i18n";
import { store } from "./store";
import {
  split,
  ApolloClient,
  InMemoryCache,
  from,
  concat,
  ApolloLink
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient as createWSClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { useNotificationsReducer } from "./atoms/notification";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  console.log(graphQLErrors, networkError);
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      useNotificationsReducer().addNotification({
        title: i18n.t("GraphQL error"),
        body: message,
        type: "error",
      })
    );
  if (networkError)
    useNotificationsReducer().addNotification({
      title: i18n.t("Network error"),
      body: networkError.message,
      type: "error",
    })
});

const getTokenFromStorage = () => {
  if (!window.localStorage.getItem("auth")) return null
  try {
    return `Bearer ${JSON.parse(window.localStorage.getItem("auth")).token}`
  } catch (error) {
    return null
  }
}

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Authorization: getTokenFromStorage(),
    }
  }));
  return forward(operation);
})

const getCombinedLink = () => from([errorLink, split(
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
        Authorization: getTokenFromStorage(),
      },
      lazy: true,
    })
  ),
  concat(authMiddleware, createUploadLink({ uri: "/api/graphql" }))
)]);

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: getCombinedLink(),
});

export const resetGraphQLLink = () => client.setLink(getCombinedLink())
