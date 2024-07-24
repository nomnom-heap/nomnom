import { gql, useLazyQuery } from "@apollo/client";

const GET_RECIPE_BY_FOLLOWED_USER_QUERY = gql`
  query getRecipeByFollowedUser($userId: ID!) {
    getRecipeByFollowedUser(userId: $userId) {
      id
      time_taken_mins
      ingredients
      ingredients_qty
      serving
      contents
      name
    }
  }
`;

interface getRecipeByFollowedUser {
  recipes: Recipe[];
}

export default function useGetRecipeByFollowedUser() {
  const [getRecipeByFollowedUser, { data, loading, error }] =
    useLazyQuery<getRecipeByFollowedUser>(GET_RECIPE_BY_FOLLOWED_USER_QUERY);

  return {
    getRecipeByFollowedUser,
    data,
    loading,
    error,
  };
}
