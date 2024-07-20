"use client";

<<<<<<< HEAD
import { useDisclosure } from "@nextui-org/react";
import { gql } from "@apollo/client/core";
import { useQuery, useLazyQuery } from "@apollo/client";
=======
>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Image,
  Button,
<<<<<<< HEAD
  Card,
  CardBody,
  CardHeader,
} from "@nextui-org/react";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { AddIngredient } from "./AddIngredient";
import { RecommendedRecipeCard } from "./RecommendedRecipeCard";
import { RecipeCard } from "./RecipeCard";
=======
} from "@nextui-org/react";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { RecipeCard } from "./RecipeCard";
import useSearchRecipes from "../_hooks/useSearchRecipes";
import { useAuth } from "../AuthProvider";
import RecipeInputModal from "./RecipeInputModal";
>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5

const Editor = dynamic(() => import("@/app/_components/BlockNoteEditor"), {
  ssr: false,
});

<<<<<<< HEAD
interface RecRecipesData {
  recRecipes: Recipe[];
}

const REC_RECIPE_QUERY = gql`
  query GetRecRecipe($ingredientName: String!) {
    recRecipes(where: { ingredients_INCLUDES: $ingredientName }) {
      id
    }
  }
`;

=======
>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5
type RecipeModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
  recipe: Recipe;
  searchIngredients?: Array<string>;
  peopleYouFollow: Object[];
  setPeopleYouFollow: React.Dispatch<React.SetStateAction<Object[]>>;
  setMutatedFavourite: React.Dispatch<React.SetStateAction<object[]>>;
  mutatedFavourite: object[];
<<<<<<< HEAD
};

=======
  onOpenEditRecipeModal: (open: boolean) => void;
};

const LIMIT = 7;

>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5
export default function RecipeModal({
  recipe,
  isOpen,
  onOpenChange,
  searchIngredients,
  peopleYouFollow,
  setPeopleYouFollow,
  setMutatedFavourite,
  mutatedFavourite,
<<<<<<< HEAD
}: RecipeModalProps) {
  const [recipeSizeAction, setRecipeSizeAction] = useState(<MdFullscreen />);

  const setRecipeSizeHandler = () => {
    if (recipeSize === "sm") {
      setRecipeSize("5xl");
      setRecipeSizeAction(<MdFullscreenExit />);
    } else {
      setRecipeSize("sm");
      setRecipeSizeAction(<MdFullscreen />);
    }
  };
  const [recipeSize, setRecipeSize] = useState<
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full"
    | undefined
  >("sm");

  const [recRecipes, setRecRecipes] = useState<Recipe[]>([]);
  const [recipeIngredients, setRecipeIngredients] = useState<Recipe[]>([]);
  const [missingIngredients, setMissingIngredients] = useState<String[]>([]);

  const {
    loading: recRecipesLoading,
    error: recRecipesError,
    data: recRecipesData,
    refetch: recRecipesRefetch,
  } = useQuery<RecRecipesData>(REC_RECIPE_QUERY);

  // useEffect(() => {
  //   const ingredientName = recipe.ingredients;
  //   if (ingredientName) {
  //     searchRecipes({
  //       variables: { searchTerm: ingredientName },
  //     });
  //   } else {
  //     setRecipeIngredients(recRecipesData?.recRecipes || []);
  //   }
  // }, [recipe.ingredients]);

  const { onClose, onOpen } = useDisclosure();

  useEffect(() => {
    if (recRecipesData) {
      setRecRecipes(recRecipes);
    }
  }, [recipe.ingredients]);

  const modalState = useRef(isOpen);
  console.log(modalState.current);

  const closePrevModal = () => {
    console.log("Opening new modal");
    console.log("Closing the previous modal");
    modalState.current;
  };
=======
  onOpenEditRecipeModal,
}: RecipeModalProps) {
  const [missingIngredients, setMissingIngredients] = useState<String[]>([]);
  const { recipes: recRecipes, setSearchTerm: setRecRecipesIngredients } =
    useSearchRecipes(LIMIT);
  const [isOwner, setIsOwner] = useState(false);

  const { userId } = useAuth();
>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5

  useEffect(() => {
    if (!searchIngredients) {
      setMissingIngredients([]);
      return;
    }

    const newMissingIngredients = recipe.ingredients.filter(
      (recipeIngredient) => {
        return (
          !searchIngredients.some((searchedIngredient) =>
            recipeIngredient.includes(searchedIngredient.trim())
          ) && recipeIngredient.trim() !== ""
        );
      }
    );

    setMissingIngredients(newMissingIngredients);
  }, [recipe.ingredients, searchIngredients]);

<<<<<<< HEAD
  return (
    <Modal
      size={recipeSize}
      scrollBehavior="inside"
      className="h-auto"
=======
  useEffect(() => {
    if (userId === recipe.owner.id) {
      setIsOwner(true);
    }
    setRecRecipesIngredients({
      recipeName: "",
      ingredients: recipe.ingredients,
    });
  }, []);

  return (
    <Modal
      scrollBehavior="inside"
      className="h-auto xs:min-w-full sm:min-w-fit"
>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5
      isOpen={isOpen}
      placement="center"
      onOpenChange={onOpenChange}
    >
      <ModalContent className="bg-white h-auto">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-4">
              <p>{recipe.name}</p>
            </ModalHeader>
            <ModalBody>
              <div className="flex items-center justify-center">
                <Image
                  className="rounded-xl"
                  src={
                    recipe.thumbnail_url
                      ? recipe.thumbnail_url
<<<<<<< HEAD
                      : "/image_placeholder.jpeg"
=======
                      : "/image_placeholder.png"
>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5
                  }
                  alt="Recipe thumbnail image"
                  style={{ width: "400px", height: "300px" }}
                />
              </div>

              <div className="flex flex-col gap-2 w-auto">
                <div className="flex flex-col gap-2 items-left">
                  {searchIngredients?.length === 0 ? (
                    ""
                  ) : missingIngredients.length > 0 ? (
                    <>
                      <p className="text-sm font-bold">Missing Ingredients:</p>
                      <p className="text-sm">{missingIngredients.join(", ")}</p>
                    </>
                  ) : (
                    <p className="text-sm text-green-500">
                      You have all ingredients! 😊
                    </p>
                  )}

                  <p className="text-sm">
                    <span className="font-bold">Preparation Time (mins):</span>{" "}
                    {recipe.time_taken_mins}
                  </p>
                </div>

                <div className="flex flex-row gap-2 items-center">
                  <p className="text-sm">
                    <span className="font-bold">Serving:</span> {recipe.serving}
                  </p>
                </div>
              </div>

              <p className="text-sm font-bold">Ingredients:</p>
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-sm">
                    {recipe.ingredients_qty[index]} {ingredient}
                  </li>
                ))}
              </ul>

              <Editor
                initialContent={JSON.parse(recipe.contents)}
                editable={false}
              />
<<<<<<< HEAD

              {/* {recRecipes.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {recRecipes.map((recipe) => (
                  <RecipeCard recipe={recipe} key={recipe.id} />
                ))}
              </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <span>No recipes found 😅 Consider creating one!</span>
                </div>
              )} */}
              <div>
                <hr></hr>
                <p className="font-bold py-3">You Might Like:</p>
                <RecipeCard
                  recipe={recipe}
                  key={recipe.id}
                  onPress={closePrevModal}
                  peopleYouFollow={peopleYouFollow}
                  setPeopleYouFollow={setPeopleYouFollow}
                  mutatedFavourite={mutatedFavourite}
                  setMutatedFavourite={setMutatedFavourite}
                />
                {/* <Button onClick={closePrevModal}>Close Prev Modal</Button> */}
=======
              <div>
                <hr />
                <p className="font-bold py-3">You Might Like:</p>

                {recRecipes.length > 0 ? (
                  <div className="grid xs:grid-cols-1 sm:grid-cols-2 gap-4">
                    {recRecipes.map((r) => {
                      if (r.id === recipe.id) return;
                      return (
                        <RecipeCard
                          recipe={r}
                          key={`${r.id}-${r.name}`}
                          peopleYouFollow={peopleYouFollow}
                          setPeopleYouFollow={setPeopleYouFollow}
                          mutatedFavourite={mutatedFavourite}
                          setMutatedFavourite={setMutatedFavourite}
                          searchIngredients={recipe.ingredients}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <span>No recipes found 😅 Consider creating one!</span>
                  </div>
                )}
>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5
              </div>
            </ModalBody>
            <ModalFooter>
              {/* If user is recipe owner, show edit and delete button */}
<<<<<<< HEAD
              {/* {recipe?.ow === user.id && ( */}
              <Button onPress={setRecipeSizeHandler}>{recipeSizeAction}</Button>
              <Button onPress={onClose}>Save</Button>
              {/* )} */}
            </ModalFooter>
=======
              {isOwner && (
                <Button onPress={() => onOpenEditRecipeModal(true)}>
                  Edit
                </Button>
              )}
            </ModalFooter>
            {/* {openEditModal && (
              <RecipeInputModal
                isOpen={isOpen}
                // onOpenChange={() => setOpenEditModal(false)}
                onOpenChange={onOpenChange}
                recipe={recipe}
              />
            )} */}
>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
