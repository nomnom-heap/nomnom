import { gql, useLazyQuery } from "@apollo/client";

interface GetFavRecipesData {
  users: User[];
}

const GET_FAV_RECIPES_QUERY = gql`
  query getFavRecipes($userId: ID!) {
    users(where: { id: $userId }) {
      id
      favourite_recipes {
        id
        name
        ingredients
        ingredients_qty
        serving
        time_taken_mins
        thumbnail_url
        contents
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
  }
`;

export default function useGetFavRecipes() {
  const [getFavRecipes, { data, loading, error }] =
    useLazyQuery<GetFavRecipesData>(GET_FAV_RECIPES_QUERY);

  return {
    getFavRecipes,
    data,
    loading,
    error,
  };
}
