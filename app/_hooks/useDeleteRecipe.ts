import { gql, useMutation } from "@apollo/client";

const DELETE_RECIPE_MUTATION = gql`
  mutation deleteRecipesMutation($recipeId: ID!) {
    deleteRecipes(where: { id: $recipeId }) {
      nodesDeleted
    }
  }
`;

interface DeleteRecipeMutationData {
  deleteRecipes: {
    nodesDeleted: number;
  };
}

interface DeleteRecipeMutationVariables {
  recipeId: string;
}

export default function useDeleteRecipe() {
  const [deleteRecipe, { data, loading, error }] = useMutation<
    DeleteRecipeMutationData,
    DeleteRecipeMutationVariables
  >(DELETE_RECIPE_MUTATION);

  return { deleteRecipe, data, loading, error };
}
