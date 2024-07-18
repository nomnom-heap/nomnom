import { useState, useEffect } from "react";
import { Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, Image, Button } from "@nextui-org/react";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import dynamic from "next/dynamic";
import { useMutation } from "@apollo/client";
import { DELETE_RECIPE_MUTATION } from "@/_lib/gql";
import RecipeInputModal from "./RecipeInputModal";

const Editor = dynamic(() => import("@/app/_components/BlockNoteEditor"), { ssr: false });

export default function RecipeModal({ recipe, isOpen, onOpenChange }) {
  const [recipeSize, setRecipeSize] = useState("sm");
  const [recipeSizeAction, setRecipeSizeAction] = useState(<MdFullscreen />);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // State to trigger refresh

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

  const handleEditClick = () => {
    setIsInputModalOpen(true);
  };

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1); // Increment key to trigger refresh
  };

  return (
    <>
      <Modal size={recipeSize} scrollBehavior="inside" className="h-auto" isOpen={isOpen} placement="center" onOpenChange={onOpenChange} key={refreshKey}>
        <ModalContent className="bg-white h-auto">
          <ModalHeader className="flex flex-col gap-4">
            <Image className="rounded-xl" src={recipe.thumbnail_url || "/image_placeholder.jpeg"} alt="Recipe thumbnail image" style={{ width: "400px", height: "300px" }} />
            <p>{recipe.name}</p>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-2 w-auto">
              <div className="flex flex-row gap-2 items-center">
                <p className="text-sm">Preparation Time (mins):</p>
                <p className="text-sm">{recipe.time_taken_mins}</p>
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
