import { getClient } from "@/_lib/apolloClient";
import { gql } from "@apollo/client/core";
import { create } from "domain";

//TODO
//create routing
//implement error handling

export default async function Home() {
  const client = getClient();
  const username = "zhiwei";

  const userQuery = gql`
    query MyQuery($username: String!) {
      users(where: { username: $username }) {
        email
        id
        username
        favourite_recipes {
          contents
        }
      }
    }
  `;
}
