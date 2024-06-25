import React, { useEffect, useState } from "react";
import { Button, Image } from "@nextui-org/react";
import { HeartIcon } from "./HeartIcon";
import { PiPencilLine } from "react-icons/pi";
import { gql } from "@apollo/client";
import { getClient } from "@/_lib/apolloClient";

const client = getClient();

const GET_USER_OWNED_RECIPES = gql`
  query GetUserOwnedRecipes($userId: ID!) {
    users(where: { id: $userId }) {
      id
      display_name
      recipes {
        name
        contents
        createdAt
        ingredients
        thumbnail_url
        time_taken_mins
      }
    }
  }
`;




async function UserOwnedRecipes() {
  const userId = "89fa054c-2071-7009-5a38-05265e229ccd";
  const { data, error } = await client.query({ query: GET_USER_OWNED_RECIPES, variables: { userId } });

  if (error) {
    return <p>Error: {error.message}</p>;
  }
  if (!data) {
    return <p>Loading...</p>;
  }

  const recipes = data.users[0].recipes;
  const recipeCount = recipes.length;

  return (
    <div>
      <h1>{data.users[0].display_name}'s Recipes</h1>
      <p>Number of recipes: {recipeCount}</p>
      <div className="border-2 border-black rounded-full flex items-end mb-4">
        <p className="ml-auto mr-2">My Favourites😊</p>
      </div >
      <div className="flex justify-end">
      <Button color="" className="mr-2">
        <span className="relative mr-2">Create Recipe</span>
        <PiPencilLine className="text-gray-400" />
      </Button>
      </div>
      <ul className="grid grid-cols-2 gap-2">
        {recipes.map((recipe) => (
          <li key={recipe.name}>
            <div className="rounded-lg border-2 border-white bg-gray-100 p-2 flex flex-col items-center" style={{ height: "200px", width: "180px", margin: "10px" }}>
              <img src={recipe.thumbnail_url} alt={recipe.name} className="rounded-lg" style={{ height: "150px", width: "100%", objectFit: "cover" }} />
              <div className="relative mt-4" style={{ width: "100%" }}>
                <h2 style={{ 
                  maxWidth: "100%", 
                  wordWrap: "break-word", 
                  maxHeight: "3em", 
                  lineHeight: "1.5em", 
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>
                  {recipe.name}
                </h2>
                <Button isIconOnly color="danger" aria-label="Like" className="absolute right-0 bottom-0">
                  <HeartIcon
                    fill="currentColor"
                    filled={true}
                    size={24}
                    height={24}
                    width={24}
                    label="heart icon"
                  />
                </Button>
              </div>
              <p className="mt-2 self-end text-sm text-gray-500" style={{ alignSelf: 'flex-end' }}>🕛{recipe.time_taken_mins} mins</p>

            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const App = () => {
  return (
    <div>
      <UserOwnedRecipes />
    </div>
  );
};

export default App;
