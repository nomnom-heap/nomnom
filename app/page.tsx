"use client";
// Import from third-party libraries
import { Inter } from "next/font/google";
import { Checkbox, ListboxSection } from "@nextui-org/react";
import {
  useQuery,
  useLazyQuery,
  ApolloProvider,
  useMutation,
  RefetchQueriesFunction,
} from "@apollo/client";
import { gql } from "@apollo/client/core";
import { AutocompleteSection } from "@nextui-org/autocomplete";

// Import local components and utilities
import RootLayout from "./layout";
import { getClient, query } from "@/_lib/apolloClient";

// Import hooks from React
import { useState, useEffect } from "react";

import { fetchAuthSession } from "aws-amplify/auth";
import { SearchFunction } from "./_components/SearchFunction";
import { RecipeContainer } from "./_components/RecipeContainer";

export default function HomePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GET_ALL_RECIPES_QUERY = gql`
    query GetAllRecipes {
      recipes {
        id
        name
        contents
        ingredients
        thumbnail_url
        time_taken_mins
        serving
        favouritedByUsers {
          id
        }
      }
    }
  `;
  const GET_RECIPES_QUERY = gql`
    query SearchRecipesByName($searchTerm: String!) {
      recipes(where: { name_CONTAINS: $searchTerm }) {
        id
        name
        contents
        ingredients
        thumbnail_url
        time_taken_mins
        serving
        favouritedByUsers {
          id
        }
      }
    }
  `;

  //Declaring states
  const [recipeResult, setRecipeResult] = useState("");
  const [userId, setUserId] = useState("");

  //Declaring the queries/mutation
  const {
    loading: allRecipesLoading,
    error: allRecipesError,
    data: allRecipesData,
  } = useQuery(GET_ALL_RECIPES_QUERY);

  const [getRecipe, { loading, error, data }] = useLazyQuery(GET_RECIPES_QUERY);

  //handlers
  async function handleSearchRecipe(sanitizedSearchTerm) {
    await getRecipe({
      variables: { searchTerm: sanitizedSearchTerm },
    });
  }

  async function fetchUserId() {
    try {
      const session = await fetchAuthSession();
      const userId = session?.tokens?.accessToken.payload.sub;
      setUserId(userId);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchUserId();
    //error handler
    if (error) console.error(error);
    if (allRecipesError) console.error(allRecipesError);

    //loading handlers
    if (loading) setRecipeResult("loading");
    if (allRecipesLoading) setRecipeResult("loading");

    //result data handlers
    if (data) {
      setRecipeResult(data);
    } else if (typeof allRecipesData !== "undefined") {
      setRecipeResult(allRecipesData);
    }
  }, [
    loading,
    data,
    allRecipesLoading,
    allRecipesData,
    error,
    allRecipesError,
  ]);

  return (
    <>
      <SearchFunction onSearchRecipe={handleSearchRecipe} />
      <SortBar />
      <RecipeContainer recipeResult={recipeResult} userId={userId} />
    </>
  );
}

function SortBar() {
  return (
    <div className="flex gap-4">
      <span>Sort by</span>
      <Checkbox size="md">Time Taken</Checkbox>
      <Checkbox size="md">Preparation Time</Checkbox>
    </div>
  );
}
