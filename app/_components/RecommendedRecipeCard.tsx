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

export function RecommendedRecipeCard({ recipe }: RecipeCardProps){
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

//   const [favourited, setFavourited] = useState<boolean>(
//     userId ? recipe.favouritedByUsers.some((obj) => obj.id === userId) : false
//   );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return(
        <div>
            <Card>
                <CardHeader className="font-bold text-lg">
                    You might also like
                </CardHeader>
            <CardBody>
                <Card isPressable className="flex inline-block">
                  <Image
                  radius="lg"
                  width="25%"
                  className="object-cover rounded-xl h-[200px] w-full"
                  src="./images/charKwayTeow.jpg"
                  />
                  <span>Char Kway Teow</span>
                  <p
                  className="mt-2 text-sm text-gray-500"
                  >
                  🕛 60 mins
                </p>
                <p
                  className="mt-2 text-sm text-gray-500"
                  style={{ alignSelf: "flex-end" }}
                >
                  🍽️ 3 servings
                </p>
                  <CardFooter className="pt-0 px-3 mb-0 justify-between">
                  <div className="grid-flow-row pb-1 space-y-0.5">
                <span
                  className="mt-2 text-sm text-gray-500"
                >
                  🕛 60 mins
                </span>

                <p
                  className="mt-2 text-sm text-gray-500"
                  style={{ alignSelf: "flex-end" }}
                >
                  🍽️ 3 servings
                </p>
              </div>

              <Button
                isIconOnly
                className="bg-white"
                aria-label="Like"
              //   onClick={() => {
              //     setFavourited((value) => !value);
              //     favourited
              //       ? handleUnfavouriteRecipe(recipe.id)
              //       : handleFavouriteRecipe(recipe.id);
              //   }}
              >
                  <HeartIcon filled/>
                {/* <HeartIcon filled={favourited} /> */}
              </Button>
                </CardFooter>
                </Card>
                <Card isPressable>
                <Image
                radius="lg"
                width="25%"
                className="object-cover rounded-xl h-[200px] w-full"
                src="./images/eggFriedRice.jpg"
                />
                <span>Egg Fried Rice</span>
                </Card>
                
            </CardBody>
            </Card>
        </div>
    )
}
