import { gql } from "@apollo/client";

export const CREATE_RECIPE_MUTATION = gql`
  mutation createRecipe(
    $name: String!
    $contents: String!
    $time_taken_mins: Float!
    $ingredients: [String!]!
    $ingredients_qty: [String!]!
    $thumbnail_url: String!
    $userId: ID!
    $serving: Float!
    $joined_ingredients: String!
    $cleaned_contents: String!
  ) {
    createRecipes(
      input: {
        name: $name
        contents: $contents
        time_taken_mins: $time_taken_mins
        ingredients: $ingredients
        ingredients_qty: $ingredients_qty
        thumbnail_url: $thumbnail_url
        owner: { connect: { where: { node: { id: $userId } } } }
        serving: $serving
        cleaned_contents: $cleaned_contents
        joined_ingredients: $joined_ingredients
      }
    ) {
      info {
        nodesCreated
        relationshipsCreated
      }
      recipes {
        id
        name
        owner {
          id
          display_name
        }
      }
    }
  }
`;

export const FIND_INGREDIENTS_BY_NAME_QUERY = gql`
  query findIngredientsByNameQuery($name: String!) {
    findIngredientsByName(name: $name) {
      id
      name
      group
    }
  }
`;

export const UPDATE_RECIPE_MUTATION = gql`
  mutation updateRecipesMutation(
    $id: ID!
    $recipeName: String!
    $contents: String!
    $time_taken_mins: Float!
    $ingredients: [String!]!
    $ingredients_qty: [String!]!
    $thumbnail_url: String!
    $serving: Float!
    $joined_ingredients: String!
    $cleaned_contents: String!
  ) {
    updateRecipes(
      where: { id: $id }
      update: {
        name: $recipeName
        contents: $contents
        time_taken_mins: $time_taken_mins
        ingredients: $ingredients
        ingredients_qty: $ingredients_qty
        thumbnail_url: $thumbnail_url
        serving: $serving
        joined_ingredients: $joined_ingredients
        cleaned_contents: $cleaned_contents
      }
    ) {
      recipes {
        id
        name
        contents
        time_taken_mins
        ingredients
        ingredients_qty
        thumbnail_url
        serving
      }
    }
  }
`;

export interface UpdateRecipeMutationData {
  updateRecipes: {
    recipes: Recipe[];
  };
}
