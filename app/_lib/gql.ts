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
  mutation updateRecipe(
  $id: ID!
  $name: String!
  $contents: String!
  $time_taken_mins: Float!
  $ingredients: [String!]!
  $ingredients_qty: [String!]!
  $thumbnail_url: String!
  $serving: Float!
) {
  updateRecipes(
    where: { id: $id }
    update: {
      name: $name
      contents: $contents
      time_taken_mins: $time_taken_mins
      ingredients: $ingredients
      ingredients_qty: $ingredients_qty
      thumbnail_url: $thumbnail_url
      serving: $serving
    }
  ) {
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
    }
  } `;


export const DELETE_RECIPE_MUTATION = gql`
  mutation deleteRecipe($id: ID!) {
    deleteRecipes(where: { id: $id }) {
      nodesDeleted
    }
  }
`;
<<<<<<< HEAD


export interface GetIngredientsData {
  ingredients: Ingredient[];
}

export interface Ingredient {
  id: string;
  name: string;
  group?: string;
}
=======
>>>>>>> parent of be02710 (edit and delete done, left id)
