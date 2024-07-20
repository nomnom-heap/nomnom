import { useRef, useState } from "react";
import { Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, Image, Button, Input, Link } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { FaPlus } from "react-icons/fa";
import { IoRemoveOutline } from "react-icons/io5";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_RECIPE_MUTATION, UPDATE_RECIPE_MUTATION, GET_INGREDIENTS_QUERY } from "@/_lib/gql";
import IngredientDropdown from "./IngredientDropdown";
import { uploadFileToPublicFolder } from "../_lib/utils";
import { useAuth } from "../AuthProvider";

const Editor = dynamic(() => import("@/app/_components/BlockNoteEditor"), { ssr: false });

export default function RecipeInputModal({ recipe, isOpen, onOpenChange }) {
  const { userId } = useAuth();
  const [isEditing, setIsEditing] = useState(!recipe);
  const [recipeName, setRecipeName] = useState(recipe?.name || "");
  const [ingredientsQty, setIngredientsQty] = useState(recipe?.ingredients_qty || [""]);
  const [ingredients, setIngredients] = useState(recipe?.ingredients || [""]);
  const [contents, setContents] = useState(recipe?.contents ? JSON.parse(recipe.contents) : []);
  const [thumbnailUrl, setThumbnailUrl] = useState(recipe?.thumbnail_url || "");
  const [preparationTime, setPreparationTime] = useState(recipe?.time_taken_mins || 60);
  const [serving, setServing] = useState(recipe?.serving || 1);

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
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

  const handleRemoveIngredient = (index) => {
    if (ingredients.length === 1) return;
    setIngredients((prev) => prev.filter((_, i) => i !== index));
    setIngredientsQty((prev) => prev.filter((_, i) => i !== index));
  };

  const [recipeSize, setRecipeSize] = useState("sm");
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

  const { data: ingredientsData, loading: ingredientsLoading, error: ingredientsError } = useQuery(GET_INGREDIENTS_QUERY);

  const [createRecipe] = useMutation(CREATE_RECIPE_MUTATION);
  const [updateRecipe] = useMutation(UPDATE_RECIPE_MUTATION);

  const handleSaveRecipe = async () => {
    if (!recipeName || !userId || !contents.length || !ingredients.length || !ingredientsQty.length) {
      throw new Error("Missing required fields");
    }

    try {
      const variables = {
        name: recipeName,
        userId,
        contents: JSON.stringify(contents),
        time_taken_mins: preparationTime,
        ingredients,
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
      console.error("error creating/updating recipe", error);
    }
  };

  if (!userId) {
    return (
      <Modal size={recipeSize} scrollBehavior="inside" className="h-auto" isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
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
    <Modal size={recipeSize} scrollBehavior="inside" className="h-auto" isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
      <ModalContent className="bg-white h-auto">
        <ModalHeader className="flex flex-col gap-4">
          <Button onPress={setRecipeSizeHandler}>{recipeSizeAction}</Button>
          <Input label="Recipe name" placeholder="Recipe name" value={recipeName} onChange={(e) => setRecipeName(e.target.value)} />
        </ModalHeader>
        <ModalBody>
          <Image className="rounded-xl cursor-pointer" src={thumbnailUrl || "/image_placeholder.jpeg"} alt="Recipe thumbnail image" style={{ width: "400px", height: "300px" }} onClick={handleButtonClick} />
          <input type="file" accept="image/*" style={{ display: "none" }} ref={fileInputRef} onChange={handleImageChange} />
          <Input label="Preparation Time" type="number" value={preparationTime} onChange={(e) => setPreparationTime(e.target.value)} min={1} />
          <Input label="Serving" type="number" value={serving} onChange={(e) => setServing(e.target.value)} min={1} />
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-2 items-center">
              <p className="text-sm">Ingredients</p>
            </div>
            {ingredients.map((ingredient, index) => (
              <div className="flex flex-row gap-2 items-center" key={index}>
                <Input className="w-4/12" label="Qty" value={ingredientsQty[index]} onChange={(e) => handleAddIngredientsQty(index, e.target.value)} />
                <IngredientDropdown className="w-full" ingredients={ingredientsData?.ingredients || []} selectedIngredient={ingredient} onIngredientSelect={(value) => handleIngredientChange(index, value)} onLastIngredientFocus={() => handleLastIngredientFocus(index)} />
                <Button isIconOnly color="danger" onPress={() => handleRemoveIngredient(index)}>
                  <IoRemoveOutline />
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
          <Button onPress={handleSaveRecipe}>Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}