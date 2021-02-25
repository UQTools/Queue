import { ApolloError } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import React, { useCallback, useEffect } from "react";
import { useMeQuery } from "./generated/graphql";
import { ErrorContext } from "./utils/errors";
import { UserContext } from "./utils/user";
import { Loadable } from "./components/helpers/Loadable";
import { requestNotification } from "./utils/queue";

type Props = {};

export const ContextWrapper: React.FC<Props> = ({ children }) => {
    const { data } = useMeQuery();
    const toast = useToast({});
    const addError = useCallback(
        (error: ApolloError) => {
            toast({
                title: error.name,
                description: error.message,
                position: "bottom",
                status: "error",
                isClosable: true,
                duration: 9000,
            });
        },
        [toast]
    );
    useEffect(() => {
        requestNotification();
    }, []);
    return (
        <Loadable isLoading={!data}>
            <UserContext.Provider value={data?.me}>
                <ErrorContext.Provider value={{ addError }}>
                    {children}
                </ErrorContext.Provider>
            </UserContext.Provider>
        </Loadable>
    );
};
