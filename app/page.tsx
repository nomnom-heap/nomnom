"use client";
<<<<<<< HEAD
<<<<<<< HEAD
import { useState, useEffect } from "react";
=======
import { Checkbox, Input } from "@nextui-org/react";

<<<<<<< HEAD
import { useState, useEffect } from "react";
=======
import { Checkbox, Input } from "@nextui-org/react";
import { useState, useEffect } from "react";

import { RecipeCard } from "./_components/RecipeCard";
import LoadingSkeleton from "./_components/LoadingSkeleton";
import { SearchIcon } from "./_components/SearchIcon";
import IngredientDropdown, {
  IngredientOption,
} from "./_components/IngredientDropdown";
import useRecipes from "./_hooks/useRecipes";
import InfiniteScroll from "react-infinite-scroll-component";
import useSearchRecipes from "./_hooks/useSearchRecipes";
import React, { useState, useEffect } from 'react';
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

const LIMIT = 9;

export default function Page() {
  const [userId, setUserId] = useState<string>("");

  const [mutatedFavourite, setMutatedFavourite] = useState<object[]>([]);

  const [peopleYouFollow, setPeopleYouFollow] = useState<Object[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipeName, setRecipeName] = useState<string>('');
  const [ingredientsSelected, setIngredientsSelected] = useState<string[]>([]);
  const [isRecipeFormOpen, setIsRecipeFormOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

 
  const [searchTerm, setSearchTerm] = useState<SearchTerm>({
    recipeName: "",
    ingredients: [],
  });

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

    if (
      searchTerm.recipeName.trim() == "" &&
      searchTerm.ingredients.length == 0
    ) {
      // console.log("set all recipes");
      setRecipes(allRecipes);
    }
  }, [allRecipes]);

  useEffect(() => {
    // console.log("searchRecipes useEffect");
    if (
      searchTerm.recipeName.trim() != "" ||
      searchTerm.ingredients.length > 0
    ) {
      // console.log("set search recipes");
      setRecipes(searchRecipes);
    }
  }, [searchRecipes]);

  useEffect(() => {
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

  const handleSaveRecipe = (recipe) => {
    // Save logic here (e.g., API call)
    setIsRecipeFormOpen(false); // Close the modal after saving
  };
    setSearchRecipesSearchTerm(searchTerm);
  }, [searchTerm]);

  return (
    <>
>>>>>>> parent of be02710 (edit and delete done, left id)
      <div className="max-w-screen flex flex-col gap-4">
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

      {isRecipeFormOpen && (
        <RecipeForm
          initialRecipe={selectedRecipe}
          onSave={handleSaveRecipe}
          onClose={() => setIsRecipeFormOpen(false)}
        />
      )}
    </>
  );
}
