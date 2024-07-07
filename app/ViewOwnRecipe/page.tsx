"use client";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { PiPencilLine } from "react-icons/pi";
import { gql, useQuery } from "@apollo/client";

import { RecipeContainer } from "../_components/RecipeContainer";
import { fetchAuthSession } from "aws-amplify/auth";

const GET_USER_OWNED_RECIPES = gql`
  query GetUserOwnedRecipes($userId: ID!) {
    users(where: { id: $userId }) {
      id
      display_name
      recipes {
        id
        name
        contents
        createdAt
        ingredients
        thumbnail_url
        time_taken_mins
        serving
        favouritedByUsers {
          id
        }
      }
    }
  }
`;

function UserOwnedRecipes({ userId }) {
  const [userRecipes, setUserRecipes] = useState(null);

  const { data, loading, error } = useQuery(GET_USER_OWNED_RECIPES, {
    variables: { userId },
  });

  useEffect(() => {
    if (loading) setUserRecipes("loading recipes");

    if (data) setUserRecipes(data.users[0]);

    if (error) console.error(error);
  }, [loading, data, error]);

  if (loading || userRecipes === "loading recipes") return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!userRecipes) return <p>No recipes found.</p>;

  return (
    <div>
      <h1>{userRecipes.display_name}'s Recipes</h1>
      <p>Number of recipes: {userRecipes.recipes.length}</p>
      <div className="border-2 border-black rounded-full flex items-end mb-4">
        <p className="ml-auto mr-2">My Recipes😊</p>
      </div>
      <div className="flex justify-end">
      </div>
      <RecipeContainer recipes={userRecipes.recipes} userId={userId} />
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
