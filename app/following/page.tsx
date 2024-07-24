"use client";

import { useState, useEffect } from "react";

import { RecipeCard } from "../_components/RecipeCard";
import LoadingSkeleton from "../_components/LoadingSkeleton";
import { fetchAuthSession } from "aws-amplify/auth";
import useGetRecipeByFollowedUser from "../_hooks/useGetRecipeByFollowedUser";

export default function Page() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const { getRecipeByFollowedUser, data, loading, error } =
    useGetRecipeByFollowedUser();

  useEffect(() => {
    if (data) {
      setRecipes(data.recipes);
    }
  }, [data]);

  useEffect(() => {
    async function fetchRecipes() {
      const session = await fetchAuthSession();
      const userId = session?.tokens?.accessToken.payload.sub;
      getRecipeByFollowedUser({ variables: { userId: userId } });
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
      {recipes.length > 0 ? (
        <div className="pt-5 px-2 grid gap-4 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:px-20 md:pt-5">
          {recipes.map((recipe) => (
            <RecipeCard
              recipe={recipe}
              key={recipe.id}
              searchIngredients={[]}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <span>No recipes found 😅 Consider following some people!</span>
        </div>
      )}
    </>
  );
}