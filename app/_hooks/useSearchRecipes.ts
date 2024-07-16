import { gql, useLazyQuery } from "@apollo/client";
import { useState, useEffect } from "react";

const SEARCH_RECIPES_QUERY = gql`
  query searchRecipes($searchTerm: [String!]!, $skip: Int, $limit: Int) {
    searchRecipes(searchTerm: $searchTerm, skip: $skip, limit: $limit) {
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
    searchRecipesCount(searchTerm: $searchTerm)
  }
`;
interface SearchRecipesData {
  searchRecipes: Recipe[];
  searchRecipesCount: number;
}

export default function useSearchRecipes(limit: number = 3) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState<SearchTerm>({
    recipeName: " ",
    ingredients: [],
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [
    searchRecipes,
    {
      data: searchRecipesData,
      loading: searchRecipesLoading,
      error: searchRecipesError,
    },
  ] = useLazyQuery<SearchRecipesData>(SEARCH_RECIPES_QUERY);

  useEffect(() => {
    if (searchRecipesError) {
      console.error("searchRecipesError: ", searchRecipesError);
    }
  }, [searchRecipesError]);

  useEffect(() => {
    if (searchRecipesData) {
      if (currentPage == 1) {
        setRecipes(searchRecipesData.searchRecipes);
        // console.log("setting recipes to: ", searchRecipesData.searchRecipes);
      } else {
        setRecipes([...recipes, ...searchRecipesData.searchRecipes]);
        // console.log(
        //   "adding recipes to recipes: ",
        //   searchRecipesData.searchRecipes
        // );
      }
      setTotalPages(Math.ceil(searchRecipesData.searchRecipesCount / limit));
    }
  }, [searchRecipesData]);

  useEffect(() => {
    const _searchTerm = `${searchTerm.recipeName} ${searchTerm.ingredients.join(
      ", "
    )}`;
    if (_searchTerm.trim() == "") return;

    // const _searchTerm = searchTerm.ingredients;
    console.log(_searchTerm);
    // console.log("in useSearchRecipes hook searchTerm useEffect", _searchTerm);

    searchRecipes({
      variables: {
        searchTerm: _searchTerm,
        skip: 0,
        limit: limit,
      },
    });
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const _searchTerm = `${searchTerm.recipeName} ${searchTerm.ingredients.join(
      ", "
    )}`;
    if (_searchTerm.trim() == "") return;

    searchRecipes({
      variables: {
        searchTerm: _searchTerm,
        skip: (currentPage - 1) * limit,
        limit: limit,
      },
    });
  }, [currentPage]);

  return {
    recipes,
    currentPage,
    totalPages,
    setSearchTerm,
    setCurrentPage,
  };
}
