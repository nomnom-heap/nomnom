"use client";
import React, { useState, useEffect } from 'react';
import { createFullTextIndex, findRecipesByIngredients } from './indexCreation';

export default function Page() {
  const [ingredientString, setIngredientString] = useState('potatoes');
  const [recipes, setRecipes] = useState<{ name: string; ingredients: string[] }[]>([]);

  useEffect(() => {
    async function fetchRecipes() {
      console.log(ingredientString);
      await createFullTextIndex(); // Ensure the index is created
      const results = await findRecipesByIngredients(ingredientString);
      console.log(results);
      setRecipes(results);
    }

    fetchRecipes();
  }, [ingredientString]);

  return (
    <div>
      <h1>Recipes matching: {ingredientString}</h1>
      <ul>
        {recipes.map((recipe, index) => (
          <li key={index}>
            <h2>{recipe.name}</h2>
            <p>Ingredients: {recipe.ingredients.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
