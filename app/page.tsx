"use client";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  Chip,
  Input,
  Link,
  Spinner,
} from "@nextui-org/react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { gql } from "@apollo/client/core";

import { useState, useEffect } from "react";

import { RecipeCard } from "./_components/RecipeCard";
import LoadingSkeleton from "./_components/LoadingSkeleton";
import { SearchIcon } from "./_components/SearchIcon";

interface GetAllRecipesData {
  recipes: Recipe[];
}

interface SearchRecipesData {
  searchRecipes: Recipe[];
}

interface GetIngredientsData {
  ingredients: Ingredient[];
}

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

const GET_INGREDIENTS_QUERY = gql`
  query FindAllIngredients {
    ingredients {
      id
      name
    }
  }
`;

export default function Page() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipeName, setRecipeName] = useState<string>("");
  const [ingredientsSelected, setIngredientsSelected] = useState<string[]>([]);

  const {
    data: ingredientsData,
    loading: ingredientsLoading,
    error: ingredientsError,
  } = useQuery<GetIngredientsData>(GET_INGREDIENTS_QUERY);

  const {
    loading: allRecipesLoading,
    error: allRecipesError,
    data: allRecipesData,
  } = useQuery<GetAllRecipesData>(GET_ALL_RECIPES_QUERY);

  const [
    searchRecipes,
    {
      loading: searchRecipesLoading,
      error: searchRecipesError,
      data: searchRecipesData,
    },
  ] = useLazyQuery<SearchRecipesData>(SEARCH_RECIPES_QUERY);

  useEffect(() => {
    if (allRecipesData && allRecipesData.recipes) {
      setRecipes(allRecipesData.recipes);
    }
    if (searchRecipesData && searchRecipesData.searchRecipes) {
      setRecipes(searchRecipesData.searchRecipes);
    }
  }, [allRecipesData, searchRecipesData]);

  // search recipes when recipe name or ingredients change
  useEffect(() => {
    const searchTerm = recipeName + ingredientsSelected.join(", ");
    if (searchTerm) {
      searchRecipes({
        variables: { searchTerm: searchTerm },
      });
    } else {
      setRecipes(allRecipesData?.recipes || []);
    }
  }, [recipeName, ingredientsSelected]);

  return (
    <>
      <div className="max-w-screen flex flex-col gap-4">
        {/* Search recipe name input */}
        <Input
          label="Search"
          isClearable
          radius="lg"
          classNames={{
            label: "text-black/50 dark:text-white/90",
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "",
            inputWrapper: [],
          }}
          placeholder="Search for recipe name"
          startContent={
            <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
          }
          onChange={(e) => setRecipeName(e.target.value)}
        />

        {/* Search recipe by ingredients autocomplete */}
        <Autocomplete
          label="Ingredients"
          placeholder="Search an ingredient"
          className="max-w-screen"
          startContent={<SearchIcon />}
          onSelectionChange={(key) => {
            if (!key) return;
            const keyString = key.toString();
            if (ingredientsSelected.includes(keyString)) {
              setIngredientsSelected((prev) =>
                prev.filter((item) => item !== keyString)
              );
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
              <AutocompleteItem
                key={item.name}
                value={item.name}
                textValue={item.name}
              >
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
              <Chip
                key={item}
                onClose={() =>
                  setIngredientsSelected(
                    ingredientsSelected.filter((i) => i !== item)
                  )
                }
              >
                {item}
              </Chip>
            ))}
          </div>
        )}
      </div>

      {/* Sortbar */}
      <div className="flex gap-4">
        <span>Sort by</span>
        <Checkbox size="md">Time Taken</Checkbox>
        <Checkbox size="md">Preparation Time</Checkbox>
      </div>

      {searchRecipesLoading || allRecipesLoading ? (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[...Array(3)].map((_, i) => (
            <LoadingSkeleton key={i} />
          ))}
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
              <span>
                No recipes found 😅 Consider creating one!
                <Button as={Link} className="white" href="/demo">
                  Create Recipe
                </Button>
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
