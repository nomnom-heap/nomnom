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
