"use client";
import { RecipeCard } from "./RecipeCard";

type RecipeContainerProps = {
  recipes: Recipe[];
};

export function RecipeContainer({ recipes }: RecipeContainerProps) {
  if (recipes.length === 0) {
    return;
  }
  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {recipes.map((recipe) => (
        <RecipeCard recipe={recipe} key={recipe.id} />
      ))}
    </div>
  );
}
