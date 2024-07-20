"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Image,
  Button,
} from "@nextui-org/react";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { RecipeCard } from "./RecipeCard";
import useSearchRecipes from "../_hooks/useSearchRecipes";
import { useAuth } from "../AuthProvider";
import RecipeInputModal from "./RecipeInputModal";

const Editor = dynamic(() => import("@/app/_components/BlockNoteEditor"), {
  ssr: false,
});

type RecipeModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
  recipe: Recipe;
  searchIngredients?: Array<string>;
  peopleYouFollow: Object[];
  setPeopleYouFollow: React.Dispatch<React.SetStateAction<Object[]>>;
  setMutatedFavourite: React.Dispatch<React.SetStateAction<object[]>>;
  mutatedFavourite: object[];
  onOpenEditRecipeModal: (open: boolean) => void;
};

const LIMIT = 7;

export default function RecipeModal({
  recipe,
  isOpen,
  onOpenChange,
  searchIngredients,
  peopleYouFollow,
  setPeopleYouFollow,
  setMutatedFavourite,
  mutatedFavourite,
  onOpenEditRecipeModal,
}: RecipeModalProps) {
  const [missingIngredients, setMissingIngredients] = useState<String[]>([]);
  const { recipes: recRecipes, setSearchTerm: setRecRecipesIngredients } =
    useSearchRecipes(LIMIT);
  const [isOwner, setIsOwner] = useState(false);

  const { userId } = useAuth();

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
                      : "/image_placeholder.png"
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
              </div>
            </ModalBody>
            <ModalFooter>
              {/* If user is recipe owner, show edit and delete button */}
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
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
