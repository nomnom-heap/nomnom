import { gql, useLazyQuery } from "@apollo/client";
import { useState, useEffect } from "react";

interface GetRecipesLazyData {
  recipes: Recipe[];
  recipesAggregate: {
    count: number;
  };
}

const GET_RECIPES_LAZY_QUERY = gql`
  query getRecipes($limit: Int = 10, $offset: Int = 0) {
    recipes(
      options: { limit: $limit, offset: $offset, sort: { updatedAt: DESC } }
    ) {
      id
      name
      contents
      ingredients
      ingredients_qty
      thumbnail_url
      time_taken_mins
      serving
      owner {
        id
        display_name
        followers {
          id
        }
      }
      favouritedByUsers {
        id
      }
    }

    recipesAggregate {
      count
    }
  }
`;

export default function useRecipes(limit: number = 9) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [uniqueRecipeIds, setUniqueRecipeIds] = useState<Set<string>>(
    new Set()
  ); // fix to avoid duplicate recipes when new recipe is added for infinie scroll (using offset and limit pagination)

  const [
    getRecipes,
    {
      data: getRecipesData,
      loading: getRecipesLoading,
      error: getRecipesError,
    },
  ] = useLazyQuery<GetRecipesLazyData>(GET_RECIPES_LAZY_QUERY);

  useEffect(() => {
    if (getRecipesData) {
      const totalPages = Math.ceil(
        getRecipesData.recipesAggregate.count / limit
      );
      setTotalPages(totalPages);
      setRecipes((prevRecipes) => {
        const newRecipes = getRecipesData.recipes.filter(
          (recipe) => !uniqueRecipeIds.has(recipe.id)
        );
        return [...prevRecipes, ...newRecipes];
      });
      setUniqueRecipeIds((prevUniqueRecipeIds) => {
        const newUniqueRecipeIds = new Set(
          getRecipesData.recipes.map((recipe) => recipe.id)
        );
        return new Set([...prevUniqueRecipeIds, ...newUniqueRecipeIds]);
      });
    }
  }, [getRecipesData]);

  useEffect(() => {
    getRecipes({
      variables: { limit: limit, offset: (currentPage - 1) * limit },
    });
  }, [currentPage]);

  return {
    recipes,
    totalPages,
    currentPage,
    setCurrentPage,
  };
}
