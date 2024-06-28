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
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { AutocompleteSection } from "@nextui-org/autocomplete";

// Import local components and utilities
import RootLayout from "./layout";
import { getClient, query } from "@/_lib/apolloClient";

// Import hooks from React
import { useState, useMemo, useEffect } from "react";
import { useDisclosure } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";

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

const GET_INGREDIENTS_QUERY = gql`
  query MyQuery {
    ingredients {
      name
      value
    }
  }
`;

function IngredientSearchBar() {
  const { data, loading, error } = useQuery(GET_INGREDIENTS_QUERY);
  const [ingredient, setIngredient] = useState([]);
  const handleSelectionChange = (selectedItem) => {
    if (!ingredient.includes(selectedItem) && selectedItem != null) {
      setIngredient([...ingredient, selectedItem]);
      console.log(ingredient);
    } else {
      console.log("duplicate");
    }
  };

  const [selectedKeys, setSelectedKeys] = useState(new Set(["text"]));
  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
  );

  if (loading) {
    return <p>Loading ingredients...</p>;
  }
  const ingredients = data.ingredients;
  return (
    <>
      <Autocomplete
        label="Ingredients"
        placeholder="Search an ingredient"
        className="max-w-screen"
        disableSelectorIconRotation
        selectorIcon={<SearchIcon />}
        onSelectionChange={handleSelectionChange}
      >
        {ingredients.map((item) => (
          <AutocompleteItem key={item.value} value={item.value}>
            {item.name}
          </AutocompleteItem>
        ))}
      </Autocomplete>

      {ingredient.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4>Ingredients so far</h4>
          <ListboxWrapper>
            <Listbox
              aria-label="Single selection example"
              variant="flat"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
            >
              {ingredient.map((x) => {
                let ingredientObj = ingredients.find((el) => el.value === x);
                return <ListboxItem key={x}>{ingredientObj.name}</ListboxItem>;
              })}
            </Listbox>
          </ListboxWrapper>
          <span>
            <Button
              isIconOnly
              color="danger"
              aria-label="Like"
              onClick={() => {
                setIngredient(ingredient.filter((i) => i !== selectedValue));
              }}
            >
              <DeleteIcon />
            </Button>
          </span>
        </div>
      )}
    </>
  );
}

function RecipeCard({ recipeObj }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div className="cursor-pointer" onClick={onOpen}>
        <Card className="p-4 w-80 h-26">
          <CardHeader className="pb-0 pt-2 px-4 m-2 flex-col items-start">
            <h4 className="font-bold text-large">{recipeObj.name}</h4>
          </CardHeader>
          <CardBody className="p-2 justify-end position: static object-fit: cover">
            <Image
              isZoomed
              radius="lg"
              width="100%"
              alt="Card background"
              className="object-cover rounded-xl h-[200px] w-full"
              src={recipeObj.thumbnail_url}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </CardBody>
          <CardFooter className="justify-between">
            <p
              className="mt-2 self-end text-md text-gray-500"
              style={{ alignSelf: "flex-end" }}
            >
              🕛 {recipeObj.time_taken_mins} mins
            </p>
            <Button isIconOnly color="danger" aria-label="Like">
              <HeartIcon />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="bg-gray-300">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p> </p>
                <p> </p>
                <p> </p>
                <p> </p>
                <p> </p>
                <p>
                  <Image
                    src={recipeObj.thumbnail_url}
                    alt={recipeObj.name}
                    style={{ width: "400px", height: "300px" }}
                  />
                </p>
                {recipeObj.name}
              </ModalHeader>
              <ModalBody>
                <p>Preparation Time:🕛 {recipeObj.time_taken_mins} mins</p>
                <ul>
                  <p>Ingredients:</p>
                  {recipeObj.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
                <p>Steps:</p>
                <p>{recipeObj.contents}</p>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
