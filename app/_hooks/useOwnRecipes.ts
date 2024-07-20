import { gql, useLazyQuery } from "@apollo/client";

interface GetOwnRecipesData {
  recipes: Recipe[];
}

const GET_OWN_RECIPES_QUERY = gql`
  query getOwnRecipes($userId: ID!) {
    recipes(where: { owner: { id: $userId } }) {
      id
      name
      contents
      ingredients
      ingredients_qty
      thumbnail_url
      time_taken_mins
      serving
      owner {
        id
        display_name
        followers {
          id
        }
      }
      favouritedByUsers {
        id
      }
    }
  }
`;

export default function useOwnRecipes() {
  const [getOwnRecipes, { data, loading, error }] =
    useLazyQuery<GetOwnRecipesData>(GET_OWN_RECIPES_QUERY);

  return {
    getOwnRecipes,
    data,
    loading,
    error,
  };
}
