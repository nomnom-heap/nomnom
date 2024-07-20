import { gql, useMutation } from "@apollo/client";

const FAVOURITE_RECIPE_MUTATION = gql`
  mutation FavouriteRecipe($userId: ID!, $recipeId: ID!) {
    updateRecipes(
      where: { id: $recipeId }
      connect: { favouritedByUsers: { where: { node: { id: $userId } } } }
    ) {
      info {
        relationshipsCreated
      }
    }
  }
`;

interface FavouriteRecipeMutationData {
  updateRecipes: {
    info: {
      relationshipsCreated: number;
    };
  };
}

const UNFAVOURITE_RECIPE_MUTATION = gql`
  mutation UnfavouriteRecipe($userId: ID!, $recipeId: ID!) {
    updateRecipes(
      disconnect: { favouritedByUsers: { where: { node: { id: $userId } } } }
      where: { id: $recipeId }
    ) {
      info {
        relationshipsDeleted
      }
    }
  }
`;

interface UnfavouriteRecipeMutationData {
  updateRecipes: {
    info: {
      relationshipsDeleted: number;
    };
  };
}
export default function useFavRecipes() {
  const [
    favouriteRecipe,
    {
      loading: favouriteRecipeLoading,
      error: favouriteRecipeError,
      data: favouriteRecipeData,
    },
  ] = useMutation<FavouriteRecipeMutationData>(FAVOURITE_RECIPE_MUTATION);

  const [
    unfavouriteRecipe,
    {
      loading: unfavouriteRecipeLoading,
      error: unfavouriteRecipeError,
      data: unfavouriteRecipeData,
    },
  ] = useMutation<UnfavouriteRecipeMutationData>(UNFAVOURITE_RECIPE_MUTATION);

  return {
    favouriteRecipe,
    unfavouriteRecipe,
    favouriteRecipeLoading,
    favouriteRecipeError,
    favouriteRecipeData,
    unfavouriteRecipeLoading,
    unfavouriteRecipeError,
    unfavouriteRecipeData,
  };
}
