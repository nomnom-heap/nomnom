import React, { useEffect, useState } from "react";
import { Button, Image } from "@nextui-org/react";
import { HeartIcon } from "./HeartIcon"; // Adjust the path if needed
import { gql } from "@apollo/client";
import { getClient } from "@/_lib/apolloClient";

const client = getClient();

const GET_USER_OWNED_RECIPES = gql`
  query GetUserOwnedRecipes($userId: ID!) {
    users(where: { id: $userId }) {
      id
      username
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
  const userId = "e7360194-e411-4ad3-97dc-5a1f832a80e5";
  const { data, error } = await client.query({ query: GET_USER_OWNED_RECIPES, variables: { userId } });

  if (error) {
    return <p>Error: {error.message}</p>;
  }
  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <ul>
        {data.users[0].recipes.map((recipe) => (
          <li key={recipe.name} className="bg-gray-200 rounded-lg p-4 mb-4">
            <div className="border-2 border-black rounded-full flex items-end mb-4">
              <p className="ml-auto mr-2">My Favourites😊</p>
            </div>
            <div className="rounded-lg border-2 border-black p-4 bg-white" style={{ height: "250px", width: "190px" }}>
              <img src={recipe.thumbnail_url} alt={recipe.name} className="rounded-lg" style={{ width: "150px" }} />
              <div className="relative mt-4" style={{ height: "50px" }}>
                <h2 style={{ 
                  maxWidth: "100px", 
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
              <p className="mt-4">⏰ Time taken: {recipe.time_taken_mins} mins</p>
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
