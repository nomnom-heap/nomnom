"use client";
import { Button, Divider, Input, useDisclosure } from "@nextui-org/react";

import { Poppins } from "next/font/google";
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
import RecipeInputModal from "./_components/RecipeInputModal";

const LIMIT = 9;
const poppins = Poppins({ weight: ["600", "400"], subsets: ["latin"] });

export default function Page() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState<SearchTerm>({
    recipeName: "",
    ingredients: [],
  });

  const {
    recipes: allRecipes,
    totalPages: allRecipesTotalPages,
    currentPage: allRecipesCurrentPage,
    setCurrentPage: setAllRecipesCurrentPage,
  } = useRecipes(LIMIT);

  const {
    recipes: searchRecipes,
    currentPage: searchRecipesCurrentPage,
    totalPages: searchRecipesTotalPages,
    setCurrentPage: setSearchRecipesCurrentPage,
    setSearchTerm: setSearchRecipesSearchTerm,
  } = useSearchRecipes(LIMIT);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (
      searchTerm.recipeName.trim() == "" &&
      searchTerm.ingredients.length == 0
    ) {
      setRecipes(allRecipes);
    }
  }, [allRecipes]);

  useEffect(() => {
    if (
      searchTerm.recipeName.trim() != "" ||
      searchTerm.ingredients.length > 0
    ) {
      setRecipes(searchRecipes);
    }
  }, [searchRecipes]);

  useEffect(() => {
    if (
      searchTerm.recipeName.trim() == "" &&
      searchTerm.ingredients.length == 0
    ) {
      setRecipes(allRecipes);
      setSearchRecipesCurrentPage(1);
      return;
    }
    setSearchRecipesSearchTerm(searchTerm);
  }, [searchTerm]);

  return (
    <>
      <div className="max-w-screen pt-5 px-2 md:px-20 md:pt-5 flex flex-col gap-4">
        {/* Search recipe name input */}
        <h4
          className={`${poppins.className} text-4xl font-bold pt-10 px-10 pb-0 text-center`}
        >
          Search with NomNom! 😋
        </h4>
        <p className={`${poppins.className} pb-4 text-lg px-10 text-center`}>
          Search by recipe name, or search by what you have in your kitchen, and
          NomNom will do the rest!
        </p>
        <div className="flex flex-row items-center justify-center gap-2">
          <Divider className="w-1/3" />
          <p className="text-lg">or</p>
          <Divider className="w-1/3" />
        </div>
        <div className="flex flex-row items-center justify-center gap-2">
          <Button className="w-auto p-4" color="primary" onPress={onOpen}>
            Create My Own Recipe! 😋
          </Button>
          <RecipeInputModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onRecipeCreate={(createdRecipe: Recipe) => {
              setRecipes([createdRecipe, ...recipes]);
            }}
          />
        </div>

        <Input
          variant="bordered"
          label="Search"
          isClearable
          radius="lg"
          placeholder="Search for recipe name"
          startContent={
            <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
          }
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

      {/* TODO: Sortbar */}

      {recipes.length == 0 ? (
        <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {...Array(LIMIT).map(() => <LoadingSkeleton key={Math.random()} />)}
        </div>
      ) : (
        <InfiniteScroll
          dataLength={recipes.length}
          next={() => {
            if (
              searchTerm.recipeName.trim() != "" ||
              searchTerm.ingredients.length > 0
            ) {
              setSearchRecipesCurrentPage(searchRecipesCurrentPage + 1);
            } else {
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
          {recipes.map((recipe) => (
            <RecipeCard
              recipe={recipe}
              key={`${recipe.id}`}
              searchIngredients={searchTerm.ingredients}
              onDeleteRecipe={(deletedRecipeId) => {
                setRecipes(recipes.filter((r) => r.id !== deletedRecipeId));
              }}
            />
          ))}
        </InfiniteScroll>
      )}
    </>
  );
}
