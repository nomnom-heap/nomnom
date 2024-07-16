"use client";
import { useDisclosure } from "@nextui-org/react";
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  CardFooter,
  Button,
} from "@nextui-org/react";
import { HeartIcon } from "./HeartIcon";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client/core";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { fetchAuthSession } from "aws-amplify/auth";
import RecipeModal from "./RecipeModal";
import { useAuth } from "../AuthProvider";

type RecipeCardProps = {
  recipe: Recipe;
  onPress?:()=>void;
};

const FAVOURITE_RECIPE_MUTATION = gql`
  mutation FavouriteRecipe($userId: ID!, $recipeId: ID!) {
    updateRecipes(
      where: { id: $recipeId }
      connect: { favouritedByUsers: { where: { node: { id: $userId } } } }
    ) {
      info {
        relationshipsCreated
      }
    }
  }
`;

const UNFAVOURITE_RECIPE_MUTATION = gql`
  mutation UnfavouriteRecipe($userId: ID!, $recipeId: ID!) {
    updateRecipes(
      disconnect: { favouritedByUsers: { where: { node: { id: $userId } } } }
      where: { id: $recipeId }
    ) {
      info {
        relationshipsDeleted
      }
    }
  }
`;

export function RecipeCard({ recipe,onPress }: RecipeCardProps) {
  const { userId } = useAuth();

  const [
    favouriteRecipe,
    { loading: favouriteLoading, error: favouriteError, data: favouriteData },
  ] = useMutation(FAVOURITE_RECIPE_MUTATION);

  const [
    unfavouriteRecipe,
    {
      loading: unfavouriteLoading,
      error: unfavouriteError,
      data: unfavouriteData,
    },
  ] = useMutation(UNFAVOURITE_RECIPE_MUTATION);

  async function handleFavouriteRecipe(recipeId: string) {
    const session = await fetchAuthSession();
    const userId = session?.tokens?.accessToken.payload.sub;
    await favouriteRecipe({
      variables: { recipeId: recipeId, userId: userId },
    });
  }

  async function handleUnfavouriteRecipe(recipeId: string) {
    const session = await fetchAuthSession();
    const userId = session?.tokens?.accessToken.payload.sub;
    await unfavouriteRecipe({
      variables: { recipeId: recipeId, userId: userId },
    });
  }

  const [favourited, setFavourited] = useState<boolean>(
    userId ? recipe.favouritedByUsers.some((obj) => obj.id === userId) : false
  );

  // useEffect(() => {
  //   const fetchUserId = async () => {
  //     const session = await fetchAuthSession();
  //     const userId = session?.tokens?.accessToken.payload.sub;
  //     if (userId) {
  //       setUserId(userId);
  //     }
  //   };

  //   fetchUserId();
  //   const checkUserFav = recipe.favouritedByUsers.some(
  //     (obj) => obj.id === userId
  //   );
  //   setFavourited(checkUserFav);
  // }, []);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div className="cursor-pointer" onClick={onOpen} key={recipe.id}>
        <Card className="relative group">
          <CardHeader className="pb-0 pt-3 px-3 m-2 flex-col items-start">
            <h4 className="font-bold text-lg">{recipe.name}</h4>
          </CardHeader>
          <CardBody className="p-3 justify-end position: static object-fit: cover">
            <Image
              isZoomed
              radius="lg"
              width="100%"
              alt="Card background"
              className="object-cover rounded-xl h-[200px] w-full"
              src={recipe.thumbnail_url}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </CardBody>
          <CardFooter className="pt-0 px-3 mb-0 justify-between">
            <div className="grid-flow-row pb-1 space-y-0.5">
              <p
                className="mt-2 text-sm text-gray-500"
                style={{ alignSelf: "flex-end" }}
              >
                🕛 {recipe.time_taken_mins} mins
              </p>

              <p
                className="mt-2 text-sm text-gray-500"
                style={{ alignSelf: "flex-end" }}
              >
                🍽️ {recipe.serving} servings
              </p>
            </div>

            <Button
              isIconOnly
              className="bg-white"
              aria-label="Like"
              onClick={() => {
                setFavourited((value) => !value);
                favourited
                  ? handleUnfavouriteRecipe(recipe.id)
                  : handleFavouriteRecipe(recipe.id);
              }}
            >
              <HeartIcon filled={favourited} />
            </Button>
          </CardFooter>
        </Card>
      </div>
      <RecipeModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        recipe={recipe}
      />
      {/* <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
        <ModalContent className="bg-gray-300">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-4">
                <Image
                  className="rounded-xl"
                  src={recipe.thumbnail_url}
                  alt={recipe.name}
                  style={{ width: "400px", height: "300px" }}
                />
                {recipe.name}
              </ModalHeader>
              <ModalBody>
                <p>Preparation Time 🕛: {recipe.time_taken_mins} mins</p>
                <p>Ingredients:</p>
                <ul>
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>
                      {recipe.ingredients_qty[index]} {ingredient}
                    </li>
                  ))}
                </ul>
                <p>Steps:</p>
                <Editor />
                <p>{recipe.contents}</p>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal> */}
    </>
  );
}
