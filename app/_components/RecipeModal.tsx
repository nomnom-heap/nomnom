<<<<<<< HEAD
"use client";

=======
>>>>>>> parent of be02710 (edit and delete done, left id)
import { useDisclosure } from "@nextui-org/react";
import { gql } from "@apollo/client/core";
import { useQuery, useLazyQuery } from "@apollo/client";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Image,
  Button,
  Card,
  CardBody,
  CardHeader
} from "@nextui-org/react";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { MdFullscreen,MdFullscreenExit } from "react-icons/md";
import { AddIngredient } from "./AddIngredient";
import { RecommendedRecipeCard } from "./RecommendedRecipeCard";
import { RecipeCard } from "./RecipeCard";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_RECIPE_MUTATION } from "@/_lib/gql";
import RecipeInputModal from "./RecipeInputModal";
<<<<<<< HEAD
import { useState, useEffect, useRef } from "react";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { AddIngredient } from "./AddIngredient";
import { RecommendedRecipeCard } from "./RecommendedRecipeCard";
import { RecipeCard } from "./RecipeCard";
=======
import { useRouter } from "next/router";
import RecipeInputModal from "./RecipeInputModal"; // Import the RecipeInputModal
>>>>>>> parent of be02710 (edit and delete done, left id)

const Editor = dynamic(() => import("@/app/_components/BlockNoteEditor"), {
  ssr: false,
});

interface RecRecipesData {
  recRecipes: Recipe[];
}

const REC_RECIPE_QUERY= gql`
query GetRecRecipe ($ingredientName:String!){
  recRecipes(where: {ingredients_INCLUDES: $ingredientName}) {
    id
  }
}
`



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
  const [isInputModalOpen, setIsInputModalOpen] = useState(false); // State to control RecipeInputModal

  const toggleEditable = () => {
    setEditable(!editable);
    setIsEdited(false);
    setIsEdited(false);
  };

  const handleSave = () => {
    setIsEdited(false);
    setEditable(false);
    setEditable(false);
  };

  const handleDeleteClick = async () => {
    try {
      await deleteRecipe();
    } catch (err) {
      console.error("Error deleting recipe:", err);
    }
  };
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

  const handleEditClick = () => {
    setIsInputModalOpen(true); 

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
  }
  const [recRecipes, setRecRecipes] = useState<Recipe[]>([]);
  const [recipeIngredients, setRecipeIngredients] = useState<Recipe[]>([]);

  const 
    {
      loading: recRecipesLoading,
      error: recRecipesError,
      data: recRecipesData,
      refetch: recRecipesRefetch,
    }= useQuery<RecRecipesData>(REC_RECIPE_QUERY);

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

  const { onClose, onOpen} = useDisclosure();
  useEffect(() => {
    if (recRecipesData) {
      setRecRecipes(recRecipes);
    }
  }, [recipe.ingredients]);

  const modalState=useRef(isOpen);
  console.log(modalState.current)

  const closePrevModal=()=>{
    console.log("Opening new modal")
    console.log("Closing the previous modal")
    modalState.current
    
  }
  return (
<<<<<<< HEAD
    <Modal
      size={recipeSize}
      scrollBehavior="inside"
      className="h-auto"
      isOpen={isOpen}
      placement="center"
      onOpenChange={onOpenChange}
    >
      <ModalContent className="bg-white h-auto">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-4">
              <p>{recipe.name}</p>
=======
    <>
      <Modal
      size={recipeSize}
      scrollBehavior="inside"
        className="h-auto"
        isOpen={isOpen}
        placement="center"
        onOpenChange={onOpenChange}
      >
        <ModalContent className="bg-white h-auto">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-4">
            <p>{recipe.name}</p>
>>>>>>> parent of be02710 (edit and delete done, left id)
            </ModalHeader>
            <ModalBody>
              <div className="flex items-center justify-center">
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
<<<<<<< HEAD
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
              </div>
            </ModalBody>
            <ModalFooter>
              {/* If user is recipe owner, show edit and delete button */}
              {/* {recipe?.ow === user.id && ( */}
              <Button onPress={setRecipeSizeHandler}>{recipeSizeAction}</Button>
              <Button onPress={onClose}>Save</Button>
              {/* )} */}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
=======
                </div>
                  
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
>>>>>>> parent of be02710 (edit and delete done, left id)
  );
}