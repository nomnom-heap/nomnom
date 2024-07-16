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
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_RECIPE_MUTATION } from "@/_lib/gql";
import RecipeInputModal from "./RecipeInputModal";
import { useRouter } from "next/router";

const Editor = dynamic(() => import("@/app/_components/BlockNoteEditor"), {
  ssr: false,
});

type RecipeModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
  recipe: Recipe;
  onDelete: () => void;
};

export default function RecipeModal({
  recipe,
  isOpen,
  onOpenChange,
  onDelete,
}: RecipeModalProps) {
  const [editable, setEditable] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false); 

  const [deleteRecipe, { loading, error }] = useMutation(DELETE_RECIPE_MUTATION, {
    variables: { id: recipe.id },
    onCompleted: () => {
      onDelete(); 
      onOpenChange(); 
    },
    onError: (err) => {
      console.error("Error deleting recipe:", err);
    },
  });

  const toggleEditable = () => {
    setEditable(!editable);
    setIsEdited(false);
  };

  const handleSave = () => {
    setIsEdited(false);
    setEditable(false);
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

  return (
    <>
      <Modal
        className="h-auto"
        isOpen={isOpen}
        placement="center"
        onOpenChange={onOpenChange}
      >
        <ModalContent className="bg-white h-auto">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-4">
                <Image
                  className="rounded-xl"
                  src={
                    recipe.thumbnail_url
                      ? recipe.thumbnail_url
                      : "/image_placeholder.jpeg"
                  }
                  alt="Recipe thumbnail image"
                  style={{ width: "400px", height: "300px" }}
                />
                <p>{recipe.name}</p>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-2 w-auto">
                  <div className="flex flex-row gap-2 items-center">
                    <p className="text-sm">Preparation Time (mins):</p>
                    <p className="text-sm">{recipe.time_taken_mins}</p>
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <p className="text-sm">Serving: </p>
                    <p className="text-sm">{recipe.serving}</p>
                  </div>
                </div>

                <p className="text-sm">Ingredients:</p>
                <ul>
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-sm">
                      {recipe.ingredients_qty && recipe.ingredients_qty[index]
                        ? recipe.ingredients_qty[index]
                        : ""}{" "}
                      {ingredient}
                    </li>
                  ))}
                </ul>

                <Editor
                  initialContent={JSON.parse(recipe.contents)}
                  editable={editable}
                  onChange={() => setIsEdited(true)}
                />
              </ModalBody>
              <ModalFooter>
                {editable ? (
                  <>
                    <Button onPress={handleSave}>Save</Button>
                    <Button onPress={() => setEditable(false)}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button onPress={handleEditClick}>Edit</Button>
                    <Button color="error" onPress={handleDeleteClick} disabled={loading}>
                      {loading ? "Deleting..." : "Delete"}
                    </Button>
                  </>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <RecipeInputModal
        isOpen={isInputModalOpen}
        onOpenChange={() => setIsInputModalOpen(false)}
        recipe={recipe} 
      />
    </>
  );
}
