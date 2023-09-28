import { useEffect } from 'react';
import { gql, useSubscription } from '@apollo/client';


const TEST_SUBSCRIPTION = gql`
  subscription {
      count(target: 10)
    }
`;

const Users = () => {
    const { data, loading, error } = useSubscription(TEST_SUBSCRIPTION);

    useEffect(() => {
        console.log(data);
      }, [data]);


    return (
        <div>
        <h1>Server</h1>
        </div>
    );
}

export default Users;