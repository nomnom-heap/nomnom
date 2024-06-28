"use client";
import { useEffect } from "react";
import { RecipeCard } from "./RecipeCard";

export function RecipeContainer({ recipeResult, userId }) {
  //mutations

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {/* {flex space-x-4} */}
      {recipeResult === "loading" ? "Loading recipes..." : ""}

      {typeof recipeResult === "object" &&
        (recipeResult.recipes.length === 0
          ? "No recipes found"
          : recipeResult.recipes.map((recipe) => (
              <RecipeCard recipeObj={recipe} key={recipe.id} userId={userId} />
            )))}
    </div>
  );
}
