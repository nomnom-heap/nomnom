"use client";
import { Checkbox, Input } from "@nextui-org/react";

import { useState, useEffect, useRef, useCallback } from "react";

import { RecipeCard } from "./_components/RecipeCard";
import LoadingSkeleton from "./_components/LoadingSkeleton";
import { SearchIcon } from "./_components/SearchIcon";
import IngredientDropdown, { IngredientOption } from "./_components/IngredientDropdown";
import useRecipes from "./_hooks/useRecipes";
import InfiniteScroll from "react-infinite-scroll-component";
import useSearchRecipes from "./_hooks/useSearchRecipes";
import { Autocomplete, AutocompleteItem, Chip } from "@nextui-org/react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { gql } from "@apollo/client/core";
import RecipeForm from "./_components/RecipeForm";
import { fetchAuthSession } from "aws-amplify/auth";
import { gql, useLazyQuery } from "@apollo/client";
import { filter } from "graphql-yoga";

const LIMIT = 9;

const GET_INGREDIENTS_QUERY = gql`
  query GetIngredients {
    ingredients {
      name
    }
  }
`;

const GET_ALL_RECIPES_QUERY = gql`
  query GetAllRecipes {
    recipes {
      id
      name
      ingredients {
        name
      }
    }
  }
`;

const SEARCH_RECIPES_QUERY = gql`
  query SearchRecipes($searchTerm: String!) {
    searchRecipes(searchTerm: $searchTerm) {
      id
      name
      ingredients {
        name
      }
    }
  }
`;

interface Recipe {
  id: string;
  name: string;
  ingredients: { name: string }[];
}

interface GetAllRecipesData {
  recipes: Recipe[];
}

interface SearchRecipesData {
  searchRecipes: Recipe[];
}

interface GetIngredientsData {
  ingredients: { name: string }[];
}

interface SearchTerm {
  recipeName: string;
  ingredients: string[];
}

const GET_FOLLOWING_QUERY = gql`
  query MyQuery($userId: ID!) {
    users(where: { id: $userId }) {
      following {
        id
      }
    }
  }
`;

export default function Page() {
  const [userId, setUserId] = useState<string>("");

  const [mutatedFavourite, setMutatedFavourite] = useState<object[]>([]);

  const [peopleYouFollow, setPeopleYouFollow] = useState<Object[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filterByFollowed, setFilterByFollowed] = useState<Boolean>(false);
  const [filterByFavourited, setFilterByFavourited] = useState<Boolean>(false);
  const [searchTerm, setSearchTerm] = useState<SearchTerm>({
    recipeName: "",
    ingredients: [],
  });
  const [recipeName, setRecipeName] = useState<string>("");
  const [ingredientsSelected, setIngredientsSelected] = useState<string[]>([]);
  const [isRecipeFormOpen, setIsRecipeFormOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

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
    triggerSearchRecipes,
    {
      loading: searchRecipesLoading,
      error: searchRecipesError,
      data: searchRecipesData,
      refetch: searchRecipesRefetch,
    },
  ] = useLazyQuery<SearchRecipesData>(SEARCH_RECIPES_QUERY);

  const [
    getPeopleYouFollow,
    {
      data: getFollowingData,
      loading: getFollowingLoading,
      error: getFollowingError,
    },
  ] = useLazyQuery(GET_FOLLOWING_QUERY);

  const {
    recipes: allRecipes,
    totalPages: allRecipesTotalPages,
    currentPage: allRecipesCurrentPage,
    setCurrentPage: setAllRecipesCurrentPage,
  } = useRecipes(LIMIT);

  const {
    recipes: searchedRecipes,
    currentPage: searchRecipesCurrentPage,
    totalPages: searchRecipesTotalPages,
    setCurrentPage: setSearchRecipesCurrentPage,
    setSearchTerm: setSearchRecipesSearchTerm,
  } = useSearchRecipes(LIMIT);

  useEffect(() => {
    if (allRecipesData && allRecipesData.recipes) {
      setRecipes(allRecipesData.recipes);
    }
  }, [allRecipesData]);

  useEffect(() => {
    if (searchRecipesData && searchRecipesData.searchRecipes) {
      setRecipes(searchRecipesData.searchRecipes);
    }
  }, [searchRecipesData]);

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
      setRecipes(searchedRecipes);
    }
  }, [searchedRecipes]);

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

  const handleSaveRecipe = (recipe: Recipe) => {
    setIsRecipeFormOpen(false); // Close the modal after saving
  };

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
      <div className="max-w-screen md:px-20 md:pt-5 flex flex-col gap-4">
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
          onChange={(e) => {
            setSearchTerm({ ...searchTerm, recipeName: e.target.value });
          }}
        />

        {/* Search recipe by ingredients */}
        <div className="pb-5">
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

      {/* Sortbar */}
      {userId !== "" ? (
        <div className="flex gap-4 pb-5 px-20">
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

      {recipes.length == 0 ? (
        <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-4">
          {...Array(LIMIT).map(() => <LoadingSkeleton />)}
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
          className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-4"
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
