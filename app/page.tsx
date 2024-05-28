import { getClient } from "@/_lib/apolloClient";
import { gql } from "@apollo/client/core";

export default async function Home() {
  const client = getClient();

  const userQuery = gql`
    query MyQuery {
      users(where: { email: "zhiwei@email.com" }) {
        email
        id
        username
        favourite_recipes {
          contents
        }
      }
    }
  `;

  // const { data, loading, error } = useQuery({ query: GET_DOGS });
  const { data } = await client.query({ query: userQuery });
  console.log(data);

  return (
    // <ApolloProvider client={createApolloClient()}>
    <div>
      <h2>My first Apollo app</h2>
    </div>
    // </ApolloProvider>
  );
}
