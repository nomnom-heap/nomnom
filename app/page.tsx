"use client";
// Import from third-party libraries
import { Inter } from "next/font/google";
import { Checkbox, ListboxSection } from "@nextui-org/react";
import {
  useQuery,
  useLazyQuery,
  ApolloProvider,
  useMutation,
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
  const FAVOURITE_RECIPE_MUTATION = gql`
    mutation MyMutation($userId: ID!, $recipeId: ID!) {
      updateRecipes(
        where: { id: $recipeId }
        connect: { favouritedByUsers: { where: { node: { id: $userId } } } }
      ) {
        info {
          relationshipsCreated
        }
      }
    }
  `;

  const UNFAVOURITE_RECIPE_MUTATION = gql`
    mutation MyMutation($userId: ID!, $recipeId: ID!) {
      updateRecipes(
        disconnect: { favouritedByUsers: { where: { node: { id: $userId } } } }
        where: { id: $recipeId }
      ) {
        info {
          relationshipsDeleted
        }
      }
    }
  `;

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

  const [
    favouriteRecipe,
    { loading: favouriteLoading, error: favouriteError, data: favouriteData },
  ] = useMutation(FAVOURITE_RECIPE_MUTATION);

  const [
    unfavouriteRecipe,
    {
      loading: unfavouriteLoading,
      error: unfavouriteError,
      data: unfavouriteData,
    },
  ] = useMutation(UNFAVOURITE_RECIPE_MUTATION);

  //handlers
  async function handleSearchRecipe(sanitizedSearchTerm) {
    const session = await fetchAuthSession();
    const userId = session?.tokens?.accessToken.payload.sub;
    await getRecipe({ variables: { searchTerm: sanitizedSearchTerm } });
  }

  async function handleFavouriteRecipe(recipeId) {
    await favouriteRecipe({
      variables: { recipeId: recipeId, userId: userId },
    });
  }

  async function handleUnfavouriteRecipe(recipeId) {
    await unfavouriteRecipe({
      variables: { recipeId: recipeId, userId: userId },
    });
  }

  async function fetchUserId() {
    try {
      const session = await fetchAuthSession();
      const userId = session?.tokens?.accessToken.payload.sub;
      // console.log(userId);
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
    if (favouriteError) console.log(favouriteError);
    if (unfavouriteError) console.log(favouriteError);

    //loading handlers
    if (loading) setRecipeResult("loading");
    if (allRecipesLoading) setRecipeResult("loading");
    if (favouriteLoading) console.log("favourite loading");
    if (unfavouriteLoading) console.log("unfavourite loading");

    //result data handlers
    if (typeof data !== "undefined") setRecipeResult(data);
    else if (typeof allRecipesData !== "undefined")
      setRecipeResult(allRecipesData);

    if (typeof favouriteData !== "undefined")
      console.log(JSON.stringify(favouriteData));

    if (typeof unfavouriteData !== "undefined")
      console.log(JSON.stringify(unfavouriteData));

    // console.log(JSON.stringify(data));
    // console.log(JSON.stringify(allRecipesData));
  }, [
    loading,
    data,
    allRecipesLoading,
    allRecipesData,
    error,
    allRecipesError,
    favouriteData,
    favouriteLoading,
    favouriteError,
    unfavouriteData,
    unfavouriteError,
    unfavouriteLoading,
  ]);

  return (
    <>
      <SearchFunction onSearchRecipe={handleSearchRecipe} />
      <SortBar />
      <RecipeContainer
        recipeResult={recipeResult}
        onFavouriteRecipe={handleFavouriteRecipe}
        onUnfavouriteRecipe={handleUnfavouriteRecipe}
        userId={userId}
      />
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
