"use client";
// import { getClient } from "@/_lib/apolloClient";
import { useEffect, useState } from "react";
import { Button, Image } from "@nextui-org/react";
import { HeartIcon } from "./HeartIcon";
import { PiPencilLine } from "react-icons/pi";
import { gql } from "@apollo/client";

import { RecipeContainer } from "../_components/RecipeContainer";
import { fetchAuthSession } from "aws-amplify/auth";

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

function UserOwnedRecipes({ userId }) {
  // const userId = "89fa054c-2071-7009-5a38-05265e229ccd";
  const { data, error } = await client.query({
    query: GET_USER_OWNED_RECIPES,
    variables: { userId },
  });

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
      </div>
      <div className="flex justify-end">
        <Button color="" className="mr-2">
          <span className="relative mr-2">Create Recipe</span>
          <PiPencilLine className="text-gray-400" />
        </Button>
      </div>
      <RecipeContainer recipeResult={data} userId={userId} />
    </div>
  );
}

const App = () => {
  const [userId, setUserId] = useState("");
  async function fetchUserId() {
    try {
      const session = await fetchAuthSession();
      const userId = session?.tokens?.accessToken.payload.sub;
      setUserId(userId);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchUserId();
  }, []);

  return (
    <div>
      <UserOwnedRecipes userId={userId} />
    </div>
  );
};

export default App;
