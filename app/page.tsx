import { getClient } from "@/_lib/apolloClient";
import { gql } from "@apollo/client/core";
import { create } from "domain";

//TODO
//create routing
//implement error handling

export default async function Home() {
  const client = getClient();
  const username = "zhiwei";

  const userQuery = gql`
    query MyQuery($username: String!) {
      users(where: { username: $username }) {
        email
        id
        username
        favourite_recipes {
          contents
        }
      }
    }
  `;
}
export async function createRecipe() {
  //middleware to get client
  const client = getClient();

  //parsing request input
  //these are placeholders
  const name = "Spaghetti Aglio e Olio";
  const ingredients = [
    "Spaghetti",
    "Garlic",
    "Olive Oil",
    "Red Pepper Flakes",
    "Fresh Parsley",
    "Salt",
    "Black Pepper",
  ];
  const thumbnail_url =
    "https://upload.wikimedia.org/wikipedia/commons/6/6f/Aglio_e_olio.jpg";
  const time_taken_mins = 20;
  const contents =
    "1. Cook the spaghetti in salted boiling water according to package instructions until al dente.\n2. While the spaghetti is cooking, heat olive oil in a large skillet over medium heat.\n3. Add minced garlic and red pepper flakes to the skillet. Cook until the garlic is golden but not browned, about 2 minutes.\n4. Once the spaghetti is cooked, drain it and add it to the skillet with the garlic and oil.\n5. Toss the spaghetti in the garlic oil mixture until well coated. Season with salt and black pepper to taste.\n6. Serve the spaghetti Aglio e Olio hot, garnished with chopped parsley and grated Parmesan cheese if desired.";

  //TODO
  //implement username in order to know who created the recipe

  //mutation
  const addRecipeMutation = gql`
    mutation createRecipes(
      $name: String!
      $ingredients: [String!]!
      $thumbnail_url: String!
      $time_taken_mins: Float!
      $contents: String!
    ) {
      createRecipes(
        input: {
          name: $name
          ingredients: $ingredients
          thumbnail_url: $thumbnail_url
          time_taken_mins: $time_taken_mins
          contents: $contents
        }
      ) {
        recipes {
          id
        }
      }
    }
  `;

  //mutation result
  const { data } = await client.mutate({
    mutation: addRecipeMutation,
    variables: {
      name: name,
      ingredients: ingredients,
      thumbnail_url: thumbnail_url,
      time_taken_mins: time_taken_mins,
      contents: contents,
    },
  });
}

export async function searchIngredients() {
  const client = getClient();
  const ingredientName = "chi"; //replace this with user input
  const searchIngredients = gql`
    query MyQuery($ingredientName: String!) {
      searchIngredients(ingredientName: $ingredientName)
    }
  `;

  const { data } = await client.query({
    query: searchIngredients,
    variables: {
      ingredientName: ingredientName,
    },
  });

  return data.searchIngredients;
}

searchIngredients().then((result) => {
  console.log(result);
});
