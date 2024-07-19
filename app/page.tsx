"use client";
<<<<<<< HEAD
import { useState, useEffect } from "react";
=======
import { Checkbox, Input } from "@nextui-org/react";

import { useState, useEffect } from "react";

import { RecipeCard } from "./_components/RecipeCard";
import LoadingSkeleton from "./_components/LoadingSkeleton";
import { SearchIcon } from "./_components/SearchIcon";
>>>>>>> parent of be02710 (edit and delete done, left id)
import IngredientDropdown, {
  IngredientOption,
} from "./_components/IngredientDropdown";
import useRecipes from "./_hooks/useRecipes";
import InfiniteScroll from "react-infinite-scroll-component";
import useSearchRecipes from "./_hooks/useSearchRecipes";
<<<<<<< HEAD
=======
import React, { useState, useEffect } from 'react';
>>>>>>> parent of be02710 (edit and delete done, left id)
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  Chip,
  Input,
} from '@nextui-org/react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client/core';
import { RecipeCard } from './_components/RecipeCard';
import LoadingSkeleton from './_components/LoadingSkeleton';
import { SearchIcon } from './_components/SearchIcon';
import RecipeForm from './_components/RecipeForm'; 
<<<<<<< HEAD
=======


>>>>>>> parent of be02710 (edit and delete done, left id)

const GET_ALL_RECIPES_QUERY = gql`
  query GetAllRecipes {
    recipes {
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
  }
`;

const SEARCH_RECIPES_QUERY = gql`
  query searchRecipes($searchTerm: String) {
    searchRecipes(searchTerm: $searchTerm) {
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
  }
`;

<<<<<<< HEAD
const GET_INGREDIENTS_QUERY = gql`
  query FindAllIngredients {
    ingredients {
      id
      name
    }
  }
`;

const LIMIT = 9;

const GET_FOLLOWING_QUERY = gql`
  query MyQuery($userId: ID!) {
    users(where: { id: $userId }) {
      following {
        id
      }
    }
  }
`;
=======
const LIMIT = 9;
>>>>>>> parent of be02710 (edit and delete done, left id)

export default function Page() {
  const [userId, setUserId] = useState<string>("");

  const [mutatedFavourite, setMutatedFavourite] = useState<object[]>([]);

  const [peopleYouFollow, setPeopleYouFollow] = useState<Object[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipeName, setRecipeName] = useState<string>('');
  const [ingredientsSelected, setIngredientsSelected] = useState<string[]>([]);
  const [isRecipeFormOpen, setIsRecipeFormOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

<<<<<<< HEAD
  const [filterByFollowed, setFilterByFollowed] = useState<Boolean>(false);
  const [filterByFavourited, setFilterByFavourited] = useState<Boolean>(false);
  const [searchTerm, setSearchTerm] = useState({
=======
 
  const [searchTerm, setSearchTerm] = useState<SearchTerm>({
>>>>>>> parent of be02710 (edit and delete done, left id)
    recipeName: "",
    ingredients: [],
  });

<<<<<<< HEAD
  const [
    getPeopleYouFollow,
    {
      data: getFollowingData,
      loading: getFollowingLoading,
      error: getFollowingError,
    },
  ] = useLazyQuery(GET_FOLLOWING_QUERY);

  const { data: ingredientsData, loading: ingredientsLoading } = useQuery(GET_INGREDIENTS_QUERY);

  const { recipes: allRecipes, totalPages: allRecipesTotalPages, currentPage: allRecipesCurrentPage, setCurrentPage: setAllRecipesCurrentPage } = useRecipes(LIMIT);
=======
  const {
    data: ingredientsData,
    loading: ingredientsLoading,
  } = useQuery(GET_INGREDIENTS_QUERY);
    recipes: allRecipes,
    totalPages: allRecipesTotalPages,
    currentPage: allRecipesCurrentPage,
    setCurrentPage: setAllRecipesCurrentPage,
  } = useRecipes(LIMIT);
>>>>>>> parent of be02710 (edit and delete done, left id)

  const {
    loading: allRecipesLoading,
    data: allRecipesData,
  } = useQuery(GET_ALL_RECIPES_QUERY);

  const [
    searchRecipes,
    {
      loading: searchRecipesLoading,
      data: searchRecipesData,
    },
  ] = useLazyQuery(SEARCH_RECIPES_QUERY);
    recipes: searchRecipes,
    currentPage: searchRecipesCurrentPage,
    totalPages: searchRecipesTotalPages,
    setCurrentPage: setSearchRecipesCurrentPage,
    setSearchTerm: setSearchRecipesSearchTerm,
  } = useSearchRecipes(LIMIT);
  const { loading: allRecipesLoading, data: allRecipesData } = useQuery(GET_ALL_RECIPES_QUERY);

  const [executeSearchRecipes, { loading: searchRecipesLoading, data: searchRecipesData }] = useLazyQuery(SEARCH_RECIPES_QUERY);

  const { recipes: searchRecipes, currentPage: searchRecipesCurrentPage, totalPages: searchRecipesTotalPages, setCurrentPage: setSearchRecipesCurrentPage, setSearchTerm: setSearchRecipesSearchTerm } = useSearchRecipes(LIMIT);

  useEffect(() => {
    if (allRecipesData && allRecipesData.recipes) {
      setRecipes(allRecipesData.recipes);
    }
    if (searchRecipesData && searchRecipesData.searchRecipes) {
      setRecipes(searchRecipesData.searchRecipes);
    }
  }, [allRecipesData, searchRecipesData]);

  // const {
  //   recipes: FavouriteRecipes,
  //   totalPages: FavouriteRecipesTotalPages,
  //   currentPage: favouriteRecipesCurrentPage,
  //   setCurrentPage: setFavouriteRecipesCurrentPage,
  // } = useRecipesFilterFavourites(LIMIT);

  useEffect(() => {
    if (allRecipesData && allRecipesData.recipes) {
      setRecipes(allRecipesData.recipes);
    }
    if (searchRecipesData && searchRecipesData.searchRecipes) {
      setRecipes(searchRecipesData.searchRecipes);
    }
  }, [allRecipesData, searchRecipesData]);

<<<<<<< HEAD
  useEffect(() => {
    const searchTerm = recipeName + ingredientsSelected.join(", ");
    if (searchTerm) {
      triggerSearchRecipes({
        variables: { searchTerm: searchTerm },
      });
    }
  }, [recipeName, ingredientsSelected]);

  // const {
  //   recipes: FavouriteRecipes,
  //   totalPages: FavouriteRecipesTotalPages,
  //   currentPage: favouriteRecipesCurrentPage,
  //   setCurrentPage: setFavouriteRecipesCurrentPage,
  // } = useRecipesFilterFavourites(LIMIT);

  useEffect(() => {
=======
>>>>>>> parent of be02710 (edit and delete done, left id)
    if (
      searchTerm.recipeName.trim() == "" &&
      searchTerm.ingredients.length == 0
    ) {
<<<<<<< HEAD
    if (searchTerm.recipeName.trim() === "" && searchTerm.ingredients.length === 0) {
=======
      // console.log("set all recipes");
>>>>>>> parent of be02710 (edit and delete done, left id)
      setRecipes(allRecipes);
    }
  }, [allRecipes]);

  useEffect(() => {
<<<<<<< HEAD
    if (searchTerm.recipeName.trim() !== "" || searchTerm.ingredients.length > 0) {
=======
    // console.log("searchRecipes useEffect");
    if (
      searchTerm.recipeName.trim() != "" ||
      searchTerm.ingredients.length > 0
    ) {
      // console.log("set search recipes");
>>>>>>> parent of be02710 (edit and delete done, left id)
      setRecipes(searchRecipes);
    }
  }, [searchRecipes]);

  useEffect(() => {
<<<<<<< HEAD
    const searchTermString = recipeName + ingredientsSelected.join(', ');
    if (searchTermString) {
      executeSearchRecipes({ variables: { searchTerm: searchTermString } });
    } else {
      setRecipes(allRecipesData?.recipes || []);
    }

    if (searchTerm.recipeName.trim() === "" && searchTerm.ingredients.length === 0) {
=======
    const searchTerm = recipeName + ingredientsSelected.join(', ');
    if (searchTerm) {
      searchRecipes({
        variables: { searchTerm: searchTerm },
      });
    } else {
      setRecipes(allRecipesData?.recipes || []);
    // console.log("searcTerm useEffect");
    if (
      searchTerm.recipeName.trim() == "" &&
      searchTerm.ingredients.length == 0
    ) {
>>>>>>> parent of be02710 (edit and delete done, left id)
      setRecipes(allRecipes);
      setSearchRecipesCurrentPage(1);
      return;
    }
  }, [recipeName, ingredientsSelected]);
<<<<<<< HEAD

  const handleSaveRecipe = (recipe) => {
    setIsRecipeFormOpen(false);
  };
=======
>>>>>>> parent of be02710 (edit and delete done, left id)

  const handleSaveRecipe = (recipe) => {
    // Save logic here (e.g., API call)
    setIsRecipeFormOpen(false); // Close the modal after saving
  };
    setSearchRecipesSearchTerm(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    async function fetchAuth() {
      const session = await fetchAuthSession();
      const userId = session?.tokens?.accessToken.payload.sub;

      if (userId) {
        setUserId(userId);
        getPeopleYouFollow({ variables: { userId: userId } });
      }
    }

    fetchAuth();
  }, []);

  useEffect(() => {
    if (getFollowingError) {
      console.error("getFollowingDataError: ", getFollowingError);
    }

    if (getFollowingData) {
      setPeopleYouFollow(getFollowingData.users[0].following);
      console.log(JSON.stringify(getFollowingData.users[0].following));
    }
  }, [getFollowingError, getFollowingData]);

  // useEffect(() => {
  //   if (filterByFavourited && mutatedFavourite.length > 0) {
  //     setRecipes(FavouriteRecipes);
  //   }
  // }, [filterByFavourited, mutatedFavourite]);

  return (
    <>
<<<<<<< HEAD
      <div className="max-w-screen pt-5 px-2 md:px-20 md:pt-5 flex flex-col gap-4">
        {/* Search recipe name input */}
=======
      <div className="max-w-screen flex flex-col gap-4">
>>>>>>> parent of be02710 (edit and delete done, left id)
        <Input
          label="Search"
          isClearable
          radius="lg"
          classNames={{
            label: 'text-black/50 dark:text-white/90',
            input: [
              'bg-transparent',
              'text-black/90 dark:text-white/90',
              'placeholder:text-default-700/50 dark:placeholder:text-white/60',
            ],
            innerWrapper: '',
            inputWrapper: [],
          }}
          placeholder="Search for recipe name"
          startContent={
            <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
          }
          onChange={(e) => setRecipeName(e.target.value)}
        />
        <Autocomplete
          label="Ingredients"
          placeholder="Search an ingredient"
          className="max-w-screen"
          startContent={<SearchIcon />}
          onSelectionChange={(key) => {
            const keyString = key.toString();
            if (ingredientsSelected.includes(keyString)) {
              setIngredientsSelected((prev) => prev.filter((item) => item !== keyString));
            } else {
              setIngredientsSelected((prev) => [...prev, keyString]);
            }
          }}
        >
          {ingredientsLoading ? (
            <AutocompleteItem
              key="loading"
              textValue="Loading ingredients..."
              className="flex justify-center items-center"
            >
              <p>Loading ingredients...</p>
            </AutocompleteItem>
          ) : ingredientsData?.ingredients ? (
            ingredientsData.ingredients.map((item) => (
              <AutocompleteItem key={item.name} value={item.name} textValue={item.name}>
                {item.name}
              </AutocompleteItem>
            ))
          ) : (
            <p>No ingredients found</p>
          )}
        </Autocomplete>
        {ingredientsSelected.length > 0 && (
          <div className="flex gap-2">
            {ingredientsSelected.map((item) => (
              <Chip key={item} onClose={() => setIngredientsSelected(ingredientsSelected.filter((i) => i !== item))}>
                {item}
              </Chip>
            ))}
          </div>
        )}
          onChange={(e) => {
            // if (e.target.value.trim() === "") return; // use search all recipes instead of search recipes by name
            setSearchTerm({ ...searchTerm, recipeName: e.target.value });
          }}
        />

        {/* Search recipe by ingredients */}
        <div className="pb-5 px-2">
          <IngredientDropdown
            className="z-20"
            isMulti
            isClearable
            placeholder="Search for ingredient(s)"
            onChange={(newValue, actionMeta) => {
              newValue = newValue as IngredientOption[];
              setSearchTerm({
                ...searchTerm,
                ingredients: newValue.map((item) => item.value),
              });
            }}
          />
        </div>
      </div>

<<<<<<< HEAD
      {/* Sortbar */}
      {userId !== "" ? (
        <div className="flex gap-4 pb-0 px-5 md:px-20">
          <span>Filter by</span>
          <Checkbox
            size="md"
            onValueChange={(value) => setFilterByFollowed(value)}
          >
            Followed Users
          </Checkbox>
          <Checkbox
            size="md"
            onValueChange={(value) => setFilterByFavourited(value)}
          >
            Favourited
          </Checkbox>
        </div>
      ) : (
        ""
      )}
=======
      <div className="flex gap-4">
        <span>Sort by</span>
        <Checkbox size="md">Time Taken</Checkbox>
        <Checkbox size="md">Preparation Time</Checkbox>
      </div>
>>>>>>> parent of be02710 (edit and delete done, left id)

      {recipes.length == 0 ? (
        <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {...Array(LIMIT).map(() => <LoadingSkeleton />)}
        </div>
      ) : (
<<<<<<< HEAD
        <InfiniteScroll
          dataLength={recipes.length}
          next={() => {
            if (
              searchTerm.recipeName.trim() != "" ||
              searchTerm.ingredients.length > 0
            ) {
              // console.log("searching more recipes based on search term");
              setSearchRecipesCurrentPage(searchRecipesCurrentPage + 1);
            } else {
              // console.log("searching more recipes");
              setAllRecipesCurrentPage(allRecipesCurrentPage + 1);
            }
          }}
          hasMore={
            searchTerm.recipeName.trim() != "" ||
            searchTerm.ingredients.length > 0
              ? searchRecipesCurrentPage <= searchRecipesTotalPages
              : allRecipesCurrentPage < allRecipesTotalPages
          }
          loader={<LoadingSkeleton />}
          className="pt-5 px-2 grid gap-4 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:px-20 md:pt-5"
        >
          {filterByFollowed && filterByFavourited
            ? peopleYouFollow &&
              recipes
                .filter((recipe) => {
                  const followStatus = peopleYouFollow.some(
                    (person) => person.id === recipe.owner.id
                  );
                  if (!mutatedFavourite.some((obj) => obj.id === recipe.id)) {
                    let favouriteStatus = recipe.favouritedByUsers.some(
                      (user) => user.id === userId
                    );
=======
        <div>
          {recipes.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {recipes.map((recipe) => (
                <RecipeCard recipe={recipe} key={recipe.id} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <span>No recipes found 😅 Consider creating one!</span>
            </div>
          )}
        </div>
      )}
>>>>>>> parent of be02710 (edit and delete done, left id)

                    return favouriteStatus && followStatus;
                  } else {
                    let favouriteStatus = mutatedFavourite.some(
                      (obj) => obj.id === recipe.id && obj.like === true
                    );
                    return favouriteStatus;
                  }
                })

                .map((recipe, index) => (
                  <RecipeCard
                    recipe={recipe}
                    key={`${recipe.id}-${index}`}
                    peopleYouFollow={peopleYouFollow}
                    setPeopleYouFollow={setPeopleYouFollow}
                    setMutatedFavourite={setMutatedFavourite}
                    mutatedFavourite={mutatedFavourite}
                    searchIngredients={searchTerm.ingredients}
                  />
                ))
            : filterByFollowed || filterByFavourited
            ? filterByFollowed && !filterByFavourited
              ? peopleYouFollow &&
                recipes
                  .filter((recipe) =>
                    peopleYouFollow.some(
                      (person) => person.id === recipe.owner.id
                    )
                  )
                  .map((recipe, index) => (
                    <RecipeCard
                      recipe={recipe}
                      key={`${recipe.id}-${index}`}
                      peopleYouFollow={peopleYouFollow}
                      setPeopleYouFollow={setPeopleYouFollow}
                      setMutatedFavourite={setMutatedFavourite}
                      mutatedFavourite={mutatedFavourite}
                      searchIngredients={searchTerm.ingredients}
                    />
                  ))
              : !filterByFollowed &&
                filterByFavourited &&
                recipes
                  .filter((recipe) => {
                    if (!mutatedFavourite.some((obj) => obj.id === recipe.id)) {
                      let favouriteStatus = recipe.favouritedByUsers.some(
                        (user) => user.id === userId
                      );

                      return favouriteStatus;
                    } else {
                      let favouriteStatus = mutatedFavourite.some(
                        (obj) => obj.id === recipe.id && obj.like === true
                      );
                      return favouriteStatus;
                    }
                  })

                  .map((recipe, index) => (
                    <RecipeCard
                      recipe={recipe}
                      key={`${recipe.id}-${index}`}
                      peopleYouFollow={peopleYouFollow}
                      setPeopleYouFollow={setPeopleYouFollow}
                      setMutatedFavourite={setMutatedFavourite}
                      mutatedFavourite={mutatedFavourite}
                      searchIngredients={searchTerm.ingredients}
                    />
                  ))
            : recipes.map((recipe, index) => (
                <RecipeCard
                  recipe={recipe}
                  key={`${recipe.id}-${index}`}
                  peopleYouFollow={peopleYouFollow}
                  setPeopleYouFollow={setPeopleYouFollow}
                  setMutatedFavourite={setMutatedFavourite}
                  mutatedFavourite={mutatedFavourite}
                  searchIngredients={searchTerm.ingredients}
                />
              ))}
        </InfiniteScroll>
      )}
    </>
  );
}
