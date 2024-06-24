import { gql } from "@apollo/client/core";


//gql query to get user owned recipes  

export const GET_USER_OWNED_RECIPES = gql`
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

//gql query to search for recipe by name
export const SEARCH_RECIPES_BY_NAME = gql`
  query SearchRecipesByName($searchTerm: String!) {
    recipes(where: { ingredients_INCLUDES: $searchTerm }) {
      name
      contents
      ingredients
      thumbnail_url
      time_taken_mins
    }
  }
`;