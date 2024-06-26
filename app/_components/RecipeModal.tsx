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

const Editor = dynamic(() => import("@/app/_components/BlockNoteEditor"), {
  ssr: false,
});

type RecipeModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
  recipe: Recipe;
};

export default function RecipeModal({
  recipe,
  isOpen,
  onOpenChange,
}: RecipeModalProps) {
  return (
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
                    {recipe.ingredients_qty[index]} {ingredient}
                  </li>
                ))}
              </ul>

              <Editor
                initialContent={JSON.parse(recipe.contents)}
                editable={false}
              />
            </ModalBody>
            <ModalFooter>
              {/* If user is recipe owner, show edit and delete button */}
              {/* {recipe?.ow === user.id && ( */}
              <Button onPress={onClose}>Save</Button>
              {/* )} */}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
