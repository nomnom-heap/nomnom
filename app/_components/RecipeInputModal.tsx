import { useRef, useState } from "react";
import { Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, Image, Button, Input, Link } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { FaPlus } from "react-icons/fa";
import { IoRemoveOutline } from "react-icons/io5";
<<<<<<< HEAD
import { MdFullscreen,MdFullscreenExit } from "react-icons/md";

=======
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5

const Editor = dynamic(() => import("@/app/_components/BlockNoteEditor"), {
  ssr: false,
});

import { ImageIcon } from "./ImageIcon";
<<<<<<< HEAD
import { useRef, useState } from "react";
=======
import { useEffect, useRef, useState } from "react";
>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5
import { Block } from "@blocknote/core";
import { uploadFileToPublicFolder } from "../_lib/utils";
import { useAuth } from "../AuthProvider";
import { useMutation, useQuery } from "@apollo/client";
import { fetchAuthSession } from "aws-amplify/auth";
<<<<<<< HEAD
import { CREATE_RECIPE_MUTATION } from "@/_lib/gql";
import IngredientDropdown, { IngredientOption } from "./IngredientDropdown";
=======
import {
  CREATE_RECIPE_MUTATION,
  UPDATE_RECIPE_MUTATION,
  UpdateRecipeMutationData,
  GET_INGREDIENTS_QUERY,
} from "@/_lib/gql";
import IngredientDropdown, { IngredientOption } from "./IngredientDropdown";
import toast from "react-hot-toast";
>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5

type RecipeInputModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
<<<<<<< HEAD
  recipe?: any; // recipe should be provided if editing, else it should be undefined (for creating recipe)
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
<<<<<<< HEAD
    recipe?.contents ? JSON.parse(recipe.contents) : []
=======
    recipe?.contents ? JSON.parse(recipe.contents) : undefined
>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5
  );
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(
    recipe?.thumbnail_url || ""
  );
  const [preparationTime, setPreparationTime] = useState<number>(
    recipe?.time_taken_mins || 60
  );
  const [serving, setServing] = useState<number>(recipe?.serving || 1);

  const fileInputRef = useRef(null);

<<<<<<< HEAD
=======
  const [fullScreen, setFullScreen] = useState(false);

>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFileToPublicFolder(file).then((url) => setThumbnailUrl(url));
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleAddIngredientsQty = (index, value) => {
    const newIngredientsQty = [...ingredientsQty];
    newIngredientsQty[index] = value;
    setIngredientsQty(newIngredientsQty);
  };

  const handleLastIngredientFocus = (index) => {
    if (index === ingredients.length - 1) {
      setIngredients([...ingredients, ""]);
      setIngredientsQty([...ingredientsQty, ""]);
    }
  };

  const AddIngredientHandler = (index: number) => {
<<<<<<< HEAD
      setIngredients([...ingredients, ""]);
      setIngredientsQty([...ingredientsQty, ""]);
  };

  const RemoveIngredientHandler = (index: number) => {
    if(ingredients.length!=1){
      setIngredients(ingredients=>ingredients.filter((_,key)=>key!==index));
      setIngredientsQty(ingredientsQty=>ingredientsQty.filter((_,key)=>key!==index));
    }

};

    const [recipeSize,setRecipeSize]=useState<"xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full" | undefined>("sm");
    const [recipeSizeAction,setRecipeSizeAction]=useState(<MdFullscreen/>)
    
    const setRecipeSizeHandler=()=>{
      if(recipeSize==="sm"){
        setRecipeSize("5xl")
        setRecipeSizeAction(<MdFullscreenExit/>)
      }else{
        setRecipeSize("sm")
        setRecipeSizeAction(<MdFullscreen/>)
      }
    };
=======
    setIngredients([...ingredients, ""]);
    setIngredientsQty([...ingredientsQty, ""]);
  };

  const RemoveIngredientHandler = (index: number) => {
    if (ingredients.length != 1) {
      setIngredients((ingredients) =>
        ingredients.filter((_, key) => key !== index)
      );
      setIngredientsQty((ingredientsQty) =>
        ingredientsQty.filter((_, key) => key !== index)
      );
    }
  };
>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5

  const { data: ingredientsData, loading: ingredientsLoading, error: ingredientsError } = useQuery(GET_INGREDIENTS_QUERY);

  const [createRecipe] = useMutation(CREATE_RECIPE_MUTATION);
  const [updateRecipe] = useMutation(UPDATE_RECIPE_MUTATION);

<<<<<<< HEAD
  const handleSaveRecipe = async () => {
    if (!recipeName || !userId || !contents.length || !ingredients.length || !ingredientsQty.length) {
      throw new Error("Missing required fields");
    }

    try {
=======
  const [
    updateRecipe,
    {
      data: updateRecipeData,
      loading: updateRecipeLoading,
      error: updateRecipeError,
    },
  ] = useMutation<UpdateRecipeMutationData>(UPDATE_RECIPE_MUTATION);

  function extractText(data: object[]) {
    let texts: string[] = [];

    function traverse(node) {
      if (node.type === "text") {
        texts.push(node.text);
      }
      if (node.children) {
        node.children.forEach((child) => traverse(child));
      }
      if (node.content) {
        node.content.forEach((contentItem) => traverse(contentItem));
      }
    }

    data.forEach((item) => traverse(item));
    return texts.join(" ");
  }

  const handleCreateRecipe = async () => {
    try {
      const combinedList = ingredientsQty
        .map((q, index) => `${q} ${ingredients[index]}`)
        .join(", ");
      const joined_ingredients = combinedList;
      const cleaned_contents = extractText(contents);
>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5
      const variables = {
        name: recipeName,
        userId,
        contents: JSON.stringify(contents),
<<<<<<< HEAD
          time_taken_mins: preparationTime,
          ingredients: ingredients,
=======
          cleaned_contents: cleaned_contents,
          time_taken_mins: preparationTime,
          ingredients: ingredients,
          joined_ingredients: joined_ingredients,
          ingredients_qty: ingredientsQty,
          thumbnail_url: thumbnailUrl,
          serving: serving,
        },
      });
      setRecipeName("");
      setIngredients([]);
      setContents([]);
      setThumbnailUrl("");
      setPreparationTime(60);
      setServing(1);
    } catch (error: any) {
      console.error(error.message);
      console.error("error creating recipe", error);
      createErrorToast("Oops! Error creating recipe.");
    }
  };

  const handleUpdateRecipe = async () => {
    if (!recipe) {
      return;
    }
    try {
      const combinedList = ingredientsQty
        .map((q, index) => `${q} ${ingredients[index]}`)
        .join(", ");
      const joined_ingredients = combinedList;
      const cleaned_contents = extractText(contents);

      await updateRecipe({
        variables: {
          id: recipe.id,
          recipeName: recipeName,
          contents: JSON.stringify(contents),
          cleaned_contents: cleaned_contents,
        time_taken_mins: preparationTime,
        ingredients,
          joined_ingredients: joined_ingredients,
>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5
        ingredients_qty: ingredientsQty,
        thumbnail_url: thumbnailUrl,
        serving,
      };

      if (recipe) {
        await updateRecipe({ variables: { ...variables, id: recipe.id } });
      } else {
        await createRecipe({ variables });
      }

      onOpenChange();
    } catch (error) {
<<<<<<< HEAD
      console.error("error creating/updating recipe", error);
    }
  };

  if (!userId) {
    return (
      <Modal
        size={recipeSize}
=======
      console.error("error updating recipe", error);
      createErrorToast("Oops! Error updating recipe.");
    }
  };

  const handleSaveRecipe = async () => {
    if (
      !recipeName ||
      !contents.length ||
      !ingredients.length ||
      !ingredientsQty.length
    ) {
      createErrorToast(
        "Please fill in all required fields (recipe name, ingredients, ingredients quantity)."
      );
      return;
    }

    if (recipe) {
      handleUpdateRecipe();
    } else {
      handleCreateRecipe();
    }
  };

  useEffect(() => {
    if (createRecipeData) {
      createSuccessToast("Nicely done! Recipe created!");
    }
  }, [createRecipeData]);

  useEffect(() => {
    if (updateRecipeData) {
      createSuccessToast("Recipe updated!");
    }
  }, [updateRecipeData]);

  useEffect(() => {
    if (createRecipeError) {
      console.error("Error creating recipe", createRecipeError.message);
      createErrorToast("Oops! Error creating recipe.");
    }
  }, [createRecipeError]);

  if (!userId) {
    return (
      <Modal
>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5
        scrollBehavior="inside"
        className="h-auto"
        isOpen={isOpen}
        placement="center"
        onOpenChange={onOpenChange}
      >
        <ModalContent className="bg-white h-auto">
          <ModalHeader></ModalHeader>
          <ModalBody>
            <p className="text-center text-small">
              You need to be logged in to create a recipe. <Link href="/login">Login here</Link>
            </p>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal
      scrollBehavior="inside"
<<<<<<< HEAD
      className="h-auto"
=======
      className={`size-full ${fullScreen ? "min-w-full min-h-full" : ""}`}
>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5
      isOpen={isOpen}
      placement="center"
      onOpenChange={onOpenChange}
    >
<<<<<<< HEAD
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
                {/* <Button isIconOnly className='ml-auto' aria-label="Full screen" onClick={setRecipeSizeHandler}>
                        {windowIcon}
                </Button> */}
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
=======
      <ModalContent className="bg-white h-auto overflow-y-auto overflow-x-hidden">
        {(onClose) => (
          <>
            <ModalBody>
              <div className="flex-col pt-5 space-y-2">
                {thumbnailUrl ? (
                  <Image
                    className="rounded-xl"
                    src={thumbnailUrl}
                    alt={`Thumbnail image for ${recipeName}`}
                    style={{ width: "400px", height: "300px" }}
                  />
                ) : (
                  <>
                    {/* <Button isIconOnly className='ml-auto' aria-label="Full screen" onClick={setRecipeSizeHandler}>
                        {windowIcon}
                </Button> */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />
                    <Button
                      startContent={<ImageIcon />}
                      fullWidth={true}
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
                />
              </div>

>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5
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
<<<<<<< HEAD
                    readOnly={recipe ? true : false}
=======
>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5
                  />
                </div>

                <div className="flex flex-row gap-2 items-center">
                  <p className="text-sm">Serving: </p>
                  <Input
                    type="number"
                    value={serving.toString()}
                    onChange={(e) => setServing(parseFloat(e.target.value))}
                    className="w-1/4"
<<<<<<< HEAD
                    readOnly={recipe ? true : false}
=======
>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5
                  />
                </div>
              </div>

              <p className="text-sm">Ingredients:</p>
              {ingredients.map((ingredient, index) => (
<<<<<<< HEAD
                <div key={index} className="flex flex-row gap-2 items-center">
=======
                <div key={index} className="flex flex-row gap-2">
>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5
                  <Input
                    className="w-1/6 text-xs"
                    type="text"
                    placeholder="Quantity eg 1 tbsp / 500g"
                    value={ingredientsQty[index]}
                    onChange={(e) =>
                      handleAddIngredientsQty(index, e.target.value)
                    }
<<<<<<< HEAD
                    // onFocus={() => handleLastIngredientFocus(index)}
                  />
                  <IngredientDropdown
                    isClearable
                    className="w-56 mr-2"
                    placeholder="Search for ingredient"
                    menuPlacement="top"
                    // TODO: buggy delete
                    onChange={(newValue, actionMeta) => {
=======
                    onFocus={() => handleLastIngredientFocus(index)}
                  />
                  <IngredientDropdown
                    key={`ingredient-dropdown-${ingredients.length}-${index}`}
                    isClearable
                    className="min-w-60 w-auto mr-2"
                    placeholder="Search for ingredient"
                    menuPlacement="auto"
                    createOptionPosition="first"
                    blurInputOnSelect
                    allowCreateWhileLoading
                    defaultInputValue={ingredients[index]}
                    onInputChange={(newValue, actionMeta) => {
                      if (
                        actionMeta.action !== "input-change" &&
                        actionMeta.action !== "set-value"
                      )
                        return;
                      handleIngredientChange(index, newValue);
                    }}
                    onChange={(newValue, actionMeta) => {
                      if (
                        actionMeta.action !== "create-option" &&
                        actionMeta.action !== "select-option" &&
                        actionMeta.action !== "clear"
                      )
                        return;

>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5
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
<<<<<<< HEAD
                    color="danger"
=======
                    color="default"
>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5
                    aria-label="Remove ingredient"
                    onPress={() => handleRemoveIngredient(index)}
                  >
                    <span>-</span>
                  </Button>
<<<<<<< HEAD
                  {/* <Button isIconOnly aria-label="Add Ingredient" onClick={()=>AddIngredientHandler(index)}>
                  <FaPlus/>
                </Button>
              </div>
            ))}
            <Button isIconOnly color="success" onPress={() => setIngredients([...ingredients, ""])}>
              <FaPlus />
            </Button>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <p className="text-sm">Contents:</p>
            <Editor initialContent={contents} onEditorChange={(value) => setContents(value)} />
          </div>
        </ModalBody>
        <ModalFooter>
=======
                </div>
              ))}
              <Editor initialContent={contents} onChange={setContents} />
            </ModalBody>
            <ModalFooter>
>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5
          <Button onPress={handleSaveRecipe}>Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}