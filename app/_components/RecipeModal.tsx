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
import dynamic from "next/dynamic";
import { useMutation } from "@apollo/client";
import { DELETE_RECIPE_MUTATION } from "@/_lib/gql";
import RecipeInputModal from "./RecipeInputModal";
import { useAuth } from "../AuthProvider"; // Import the useAuth hook
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
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // State to trigger refresh

  const { userId } = useAuth(); // Use the useAuth hook

  const [deleteRecipe, { loading: deleteLoading }] = useMutation(DELETE_RECIPE_MUTATION, {
    variables: { id: recipe.id },
    onCompleted: () => onOpenChange(),
  });

  const setRecipeSizeHandler = () => {
    if (recipeSize === "sm") {
      setRecipeSize("5xl");
      setRecipeSizeAction(<MdFullscreenExit />);
    } else {
      setRecipeSize("sm");
      setRecipeSizeAction(<MdFullscreen />);
    }
  };

  const handleDeleteClick = async () => {
    try {
      await deleteRecipe();
    } catch (err) {
      console.error("Error deleting recipe:", err);
    }
  };

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
              <div className="flex flex-row gap-2 items-center">
                <p className="text-sm">Serving:</p>
                <p className="text-sm">{recipe.serving}</p>
              </div>
            </div>
            <p className="text-sm">Ingredients:</p>
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="text-sm">
                  {recipe.ingredients_qty && recipe.ingredients_qty[index] ? recipe.ingredients_qty[index] : ""} {ingredient}
                </li>
              ))}
            </ul>
            <Editor initialContent={JSON.parse(recipe.contents)} editable={false} />
          </ModalBody>
          <ModalFooter>
            <Button onPress={setRecipeSizeHandler}>{recipeSizeAction}</Button>
            <Button onPress={handleEditClick}>Edit</Button>
            <Button color="error" onPress={handleDeleteClick} disabled={deleteLoading}>
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <RecipeInputModal
        isOpen={isInputModalOpen}
        onOpenChange={() => setIsInputModalOpen(false)}
        onRefresh={handleRefresh} // Pass refresh function as prop
        recipe={recipe}
      />
    </>
  );
}
