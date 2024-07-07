"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Image,
  Button,
  Input,
  Link,
} from "@nextui-org/react";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("@/app/_components/BlockNoteEditor"), {
  ssr: false,
});

import { ImageIcon } from "./ImageIcon";
import { useRef, useState } from "react";
import { Block } from "@blocknote/core";
import { uploadFileToPublicFolder } from "../_lib/utils";
import { useAuth } from "../AuthProvider";
import { useMutation } from "@apollo/client";
import { fetchAuthSession } from "aws-amplify/auth";
import { CREATE_RECIPE_MUTATION } from "@/_lib/gql";
import IngredientDropdown, { IngredientOption } from "./IngredientDropdown";

type RecipeInputModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
  recipe?: Recipe; // recipe should be provided if editing, else it should be undefined (for creating recipe)
};

export default function RecipeInputModal({
  recipe,
  isOpen,
  onOpenChange,
}: RecipeInputModalProps) {
  const { userId, setUserId } = useAuth();

  const [recipeName, setRecipeName] = useState(recipe?.name || "");
  const [ingredientsQty, setIngredientsQty] = useState<string[]>(
    recipe?.ingredients_qty || [""]
  );
  const [ingredients, setIngredients] = useState<string[]>(
    recipe?.ingredients || [""]
  );
  const [contents, setContents] = useState<Block[]>(
    recipe?.contents ? JSON.parse(recipe.contents) : []
  );
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(
    recipe?.thumbnail_url || ""
  );
  const [preparationTime, setPreparationTime] = useState<number>(
    recipe?.time_taken_mins || 60
  );
  const [serving, setServing] = useState<number>(recipe?.serving || 1);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFileToPublicFolder(file).then((url) => {
        setThumbnailUrl(url);
      });
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newValue = value ?? "";
    const newIngredients = [...ingredients];
    newIngredients[index] = newValue;
    setIngredients(newIngredients);
  };

  const handleAddIngredientsQty = (index: number, value: string) => {
    const newIngredientsQty = [...ingredientsQty];
    newIngredientsQty[index] = value;
    setIngredientsQty(newIngredientsQty);
  };

  const handleLastIngredientFocus = (index: number) => {
    if (index === ingredients.length - 1) {
      setIngredients([...ingredients, ""]);
      setIngredientsQty([...ingredientsQty, ""]);
    }
  };

  const handleRemoveIngredient = (index: number) => {
    console.log(index);
    if (ingredients.length === 1) {
      return;
    }
    setIngredients((prev) => {
      const newIngredients = [...prev];
      newIngredients.splice(index, 1);
      return newIngredients;
    });

    setIngredientsQty((prev) => {
      const newIngredientsQty = [...prev];
      newIngredientsQty.splice(index, 1);
      return newIngredientsQty;
    });
  };

  const [
    createRecipe,
    {
      data: createRecipeData,
      loading: createRecipeLoading,
      error: createRecipeError,
    },
  ] = useMutation(CREATE_RECIPE_MUTATION);

  const handleSaveRecipe = async () => {
    // Ensure all required fields are provided
    if (
      !recipeName ||
      !userId ||
      !contents.length ||
      !ingredients.length ||
      !ingredientsQty.length
    ) {
      throw new Error("Missing required fields");
    }

    try {
      const session = await fetchAuthSession();
      const userId = session?.tokens?.accessToken.payload.sub;
      await createRecipe({
        variables: {
          name: recipeName,
          userId: userId,
          contents: JSON.stringify(contents),
          time_taken_mins: preparationTime,
          ingredients: ingredients,
          ingredients_qty: ingredientsQty,
          thumbnail_url: thumbnailUrl,
          serving: serving,
        },
      });
    } catch (error: any) {
      console.error(error.message);
      console.error("error creating recipe", error);
    }
  };

  if (!userId) {
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
              <ModalHeader></ModalHeader>
              <ModalBody>
                <p className="text-center text-small">
                  You need to be logged in to continue. Please log in{" "}
                  <Link size="sm" href="/login">
                    here
                  </Link>
                </p>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  }

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
              {thumbnailUrl ? (
                <Image
                  className="rounded-xl"
                  src={thumbnailUrl}
                  alt={`Thumbnail image for ${recipeName}`}
                  style={{ width: "400px", height: "300px" }}
                />
              ) : (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                  <Button
                    startContent={<ImageIcon />}
                    className="w-auto"
                    type="button"
                    onPress={handleButtonClick}
                  >
                    <span className="text-sm">Upload image</span>
                  </Button>
                </>
              )}

              <Input
                type="text"
                placeholder="Type your recipe name"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                readOnly={recipe ? true : false}
              />
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-row gap-2 items-center">
                  <p className="text-sm">Preparation Time (mins):</p>
                  <Input
                    type="number"
                    value={preparationTime.toString()}
                    onChange={(e) =>
                      setPreparationTime(parseFloat(e.target.value))
                    }
                    className="w-1/4"
                    readOnly={recipe ? true : false}
                  />
                </div>

                <div className="flex flex-row gap-2 items-center">
                  <p className="text-sm">Serving: </p>
                  <Input
                    type="number"
                    value={serving.toString()}
                    onChange={(e) => setServing(parseFloat(e.target.value))}
                    className="w-1/4"
                    readOnly={recipe ? true : false}
                  />
                </div>
              </div>

              <p className="text-sm">Ingredients:</p>
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex flex-row gap-2 items-center">
                  <Input
                    className="w-1/6 text-xs"
                    type="text"
                    placeholder="Quantity eg 1 tbsp / 500g"
                    value={ingredientsQty[index]}
                    onChange={(e) =>
                      handleAddIngredientsQty(index, e.target.value)
                    }
                    onFocus={() => handleLastIngredientFocus(index)}
                  />
                  <IngredientDropdown
                    isClearable
                    className="w-56 mr-2"
                    placeholder="Search for ingredient"
                    menuPlacement="top"
                    // TODO: buggy delete
                    onChange={(newValue, actionMeta) => {
                      const ingredient = (newValue as IngredientOption) ?? {
                        label: "",
                        value: "",
                      };
                      handleIngredientChange(index, ingredient.value);
                    }}
                    onFocus={() => handleLastIngredientFocus(index)}
                  />
                  <Button
                    isIconOnly
                    color="danger"
                    aria-label="Remove ingredient"
                    onPress={() => handleRemoveIngredient(index)}
                  >
                    <span>-</span>
                  </Button>
                </div>
              ))}
              <Editor onChange={setContents} />
            </ModalBody>
            <ModalFooter>
              <Button onPress={handleSaveRecipe}>Save</Button>
              {createRecipeData && <p>Recipe created successfully</p>}
              {createRecipeError && <p>Error creating recipe</p>}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
