import { useCallback } from "react";
import { useApolloClient } from "@apollo/client";

const useRefetch = (subscriptionName, variables) => {
  const client = useApolloClient();

  const refetch = useCallback(async () => {
    console.log(subscriptionName, variables);
    await client.refetchQueries({
      include: [subscriptionName],
      active: true,
      variables: {
        ...variables,
      },
    });
  }, [client, subscriptionName, variables]);

  return refetch;
};

export default useRefetch;
