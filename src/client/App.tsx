import * as React from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { AppRouter } from "./AppRouter";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { ContextWrapper } from "./ContextWrapper";

const client = new ApolloClient({
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
