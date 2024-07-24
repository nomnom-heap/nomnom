"use client";

import { useState, useEffect, useContext } from "react";
import { PostContext, PostDetails, PostContextType } from "../PostProvider";
import { RecipeCard } from "../_components/RecipeCard";
import LoadingSkeleton from "../_components/LoadingSkeleton";
import { fetchAuthSession } from "aws-amplify/auth";
import useGetFavRecipes from "../_hooks/useGetFavRecipes";

export default function Page() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  // @ts-ignore
  const { postDetails, setPostDetails } = useContext(PostContext);
  const [buttonPress, setButtonPress] = useState<boolean>(false);

  const { getFavRecipes, data, loading, error } = useGetFavRecipes();

  useEffect(() => {
    if (data) {
      const recipeData = data.users[0].favourite_recipes;

      if (postDetails.changedFav.length > 0) {
        setRecipes((prevsData) =>
          prevsData.filter(
            (recipe) =>
              !postDetails.changedFav.some(
                (favDetails) =>
                  favDetails.id === recipe.id && favDetails.like === false
              )
          )
        );
      } else {
        setRecipes(recipeData);
      }
    }
  }, [data, postDetails]);

  useEffect(() => {
    async function fetchRecipes() {
      const session = await fetchAuthSession();
      const userId = session?.tokens?.accessToken.payload.sub;
      getFavRecipes({ variables: { userId: userId } });
    }
    fetchRecipes();
  }, []);

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (loading) {
    return (
      <div className="pt-5 px-2 grid gap-4 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:px-20 md:pt-5">
        {Array(6).map(() => (
          <LoadingSkeleton key={Math.random()} />
        ))}
      </div>
    );
  }

  return (
    <>
      {data && recipes.length > 0 ? (
        <div className="pt-5 px-2 grid gap-4 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:px-20 md:pt-5">
          {recipes.map((recipe) => (
            <RecipeCard
              recipe={recipe}
              key={recipe.id}
              searchIngredients={[]}
              onDeleteRecipe={(deletedRecipeId) => {
                setRecipes(recipes.filter((r) => r.id !== deletedRecipeId));
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <span>No recipes found 😅 Consider favouriting one!</span>
        </div>
      )}
    </>
  );
}
