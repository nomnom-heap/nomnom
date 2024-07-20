import { gql } from "@apollo/client";

// Queries
export const GET_INGREDIENTS_QUERY = gql`
  query FindAllIngredients {
    ingredients {
      id
      name
    }
  }
`;


export const GET_USER_RECIPES_QUERY = gql`
  query GetUserRecipes($userId: ID!) {
    recipes(where: { owner: { id: $userId } }) {
      id
      name
      contents
      time_taken_mins
      ingredients
      ingredients_qty
      thumbnail_url
      serving
      owner {
        id
        display_name
      }
    }
  }
`;


export const GET_RECIPE_QUERY = gql`
  query GetRecipe($id: ID!) {
    recipe(where: { id: $id }) {
      id
      name
      contents
      time_taken_mins
      ingredients
      ingredients_qty
      thumbnail_url
      serving
      owner {
        id
        display_name
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

// Mutations
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
<<<<<<< HEAD
=======
    $joined_ingredients: String!
    $cleaned_contents: String!
>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5
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
<<<<<<< HEAD
=======
        cleaned_contents: $cleaned_contents
        joined_ingredients: $joined_ingredients
>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5
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

export interface UpdateRecipeMutationData {
  updateRecipes: {
    recipes: Recipe[];
  };
}
>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5
