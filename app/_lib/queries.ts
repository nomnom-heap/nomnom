import { getClient, query } from "@/_lib/apolloClient";
import { gql } from "@apollo/client/core";


  
const GET_USER_OWNED_RECIPES = gql`
  query GetUserOwnedRecipes($userId: ID!) {
    users(where: { id: $userId }) {
      id
      username
      recipes {
        name
        contents
        createdAt
        ingredients
        thumbnail_url
        time_taken_mins
      }
    }
  }
`;
