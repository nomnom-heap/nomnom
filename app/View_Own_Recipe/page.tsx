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
    data: recipeData,
    loading: recipesLoading,
    error: recipesError,
  } = useQuery(GET_USER_OWNED_RECIPES);

  if (recipesLoading) return <div>Loading...</div>;
  if (recipesError) return <div>Error: {recipesError.message}</div>;

  return (
    <div>
      {recipeData?.users[0]?.owns.map((recipe: Recipe, index: number) => (
        <ViewOwnRecipe key={index} recipe={recipe} />
      ))}
    </div>
  );
}

type ViewOwnRecipeProps = {
  recipe: Recipe;
};

const ViewOwnRecipe: React.FC<ViewOwnRecipeProps> = ({ recipe }) => {
  return (
    <div className="bg-gray-200 rounded-lg p-4">
      <div className="border-2 border-black rounded-full flex items-end mb-4">
        <p className="ml-auto mr-2">My Favourites😊</p>
      </div>
      <div
        className="rounded-lg border-2 border-black p-4 bg-white"
        style={{ height: "250px", width: "190px" }}
      >
        <Image
          width={150}
          alt="Recipe Image"
          src={recipe.thumbnail_url}
          className="rounded-lg"
        />
        <div className="relative mt-4" style={{ height: "50px" }}>
          <p
            style={{
              maxWidth: "100px",
              wordWrap: "break-word",
              maxHeight: "3em",
              lineHeight: "1.5em",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Dish name: {recipe.name}
          </p>
          <Button
            isIconOnly
            color="danger"
            aria-label="Like"
            className="absolute right-0 bottom-0"
          >
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
        <p className="mt-4">⏰Time: {recipe.time_taken_mins} mins</p>
      </div>
    </div>
  );
};
