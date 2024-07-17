"use client";

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
};

export default function RecipeModal({
  recipe,
  isOpen,
  onOpenChange,
}: RecipeModalProps) {
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
                <RecipeCard recipe={recipe} key={recipe.id} onPress={closePrevModal}/>
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
  );
}
