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

  const [
    getRecipes,
    {
      data: getRecipesData,
      loading: getRecipesLoading,
      error: getRecipesError,
    },
  ] = useLazyQuery<GetRecipesLazyData>(GET_RECIPES_LAZY_QUERY);

  useEffect(() => {
    // console.log("getRecipesData: ", getRecipesData);
    if (getRecipesData) {
      const totalPages = Math.ceil(
        getRecipesData.recipesAggregate.count / limit
      );
      setTotalPages(totalPages);
      // console.log("existing recipes: ", recipes);
      // console.log("getRecipesData.recipes", getRecipesData.recipes);
      setRecipes([...recipes, ...getRecipesData.recipes]);
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