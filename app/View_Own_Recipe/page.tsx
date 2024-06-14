import React from "react";
import { Button, Image } from "@nextui-org/react";
import { HeartIcon } from "./HeartIcon"; // Adjust the path if needed
import { gql, useQuery } from "@apollo/client";
import { getClient } from "@/_lib/apolloClient";

const GET_USER_OWNED_RECIPES = gql`
  query GetUserOwnedRecipes($userId: ID!) {
    users(where: { id: $userId }) {
      id
      username
      owns {
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

export default function Page() {
  const {
    data: UserData,
    loading: UserLoading,
    error: UserError,
  } = useQuery(GET_USER_OWNED_RECIPES);

  if (UserData) return <div>Loading...</div>;

  if (UserError) return <div>User Error: {UserData.message}</div>;

};
const App = () => {
  return (
    <div className="bg-gray-200 rounded-lg p-4">
      <div className="border-2 border-black rounded-full flex items-end mb-4">
        <p className="ml-auto mr-2">My Favourites😊</p>
      </div>
      <div className="rounded-lg border-2 border-black p-4 bg-white" style={{ height: "250px", width: "190px" }}>
        <Image
          width={150}
          alt="NextUI hero Image"
          src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
          className="rounded-lg"
        />
        <div className="relative mt-4" style={{ height: "50px" }}>
          <p style={{ 
            maxWidth: "100px", 
            wordWrap: "break-word", 
            maxHeight: "3em", 
            lineHeight: "1.5em", 
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
            Dish name:xxxxxxxxxxx
          </p>
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
        <p className="mt-4">⏰Time: 10:00 AM</p>
      </div>
    </div>
  );
};




