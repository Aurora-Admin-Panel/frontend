import { useState, useCallback, useEffect } from "react";
import { useApolloClient } from "@apollo/client";

const useSubscripe = (query, variables) => {
  const client = useApolloClient();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const subscribe = useCallback(() => {
    setLoading(true);
    setError(null);
    const subscription = client
      .subscribe({
        query,
        variables,
      })
      .subscribe({
        next: (data) => {
          setData(data.data);
          setLoading(false);
        },
        error: (error) => {
          setError(error);
          setLoading(false);
        },
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [client, variables, query]);

  // useEffect(() => {
  //   const unsubscribe = subscribe();
  //   return unsubscribe;
  // }, [subscribe]);

  return { data, loading, error, subscribe };
};

export default useSubscripe