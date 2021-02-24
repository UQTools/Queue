import * as React from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { AppRouter } from "./AppRouter";
import {
    ApolloClient,
    ApolloProvider,
    HttpLink,
    InMemoryCache,
    split,
} from "@apollo/client";
import { ContextWrapper } from "./ContextWrapper";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";

const hostname =
    process.env.NODE_ENV === "production"
        ? window.location.hostname +
          (window.location.port ? ":" + window.location.port : "")
        : "localhost:5000";

const httpLink = new HttpLink({
    uri: `http://${hostname}/graphql`,
});

const wsLink = new WebSocketLink({
    uri: `ws://${hostname}/subscriptions`,
    options: {
        reconnect: true,
    },
});

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
        );
    },
    wsLink,
    httpLink
);

const client = new ApolloClient({
    link: splitLink,
    uri: "/graphql",
    cache: new InMemoryCache({
        addTypename: false,
    }),
});

export const App = () => (
    <ApolloProvider client={client}>
        <ChakraProvider theme={theme}>
            <ContextWrapper>
                <AppRouter />
            </ContextWrapper>
        </ChakraProvider>
    </ApolloProvider>
);
