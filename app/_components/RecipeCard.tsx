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
import {
  useQuery,
  useLazyQuery,
  ApolloProvider,
  useMutation,
  RefetchQueriesFunction,
} from "@apollo/client";
import { gql } from "@apollo/client/core";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";

export function RecipeCard({ recipeObj, userId }) {
  // console.log(userId);
  // console.log(recipeObj.id);
  const FAVOURITE_RECIPE_MUTATION = gql`
    mutation MyMutation($userId: ID!, $recipeId: ID!) {
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
    mutation MyMutation($userId: ID!, $recipeId: ID!) {
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

  async function handleFavouriteRecipe(recipeId) {
    await favouriteRecipe({
      variables: { recipeId: recipeId, userId: userId },
    });
  }

  async function handleUnfavouriteRecipe(recipeId) {
    await unfavouriteRecipe({
      variables: { recipeId: recipeId, userId: userId },
    });
  }

  useEffect(() => {
    if (favouriteError) console.error(favouriteError);
    if (unfavouriteError) console.error(unfavouriteError);

    if (favouriteLoading) console.log("favourite loading");
    if (unfavouriteLoading) console.log("unfavourite loading");

    if (typeof favouriteData !== "undefined")
      console.log(JSON.stringify(favouriteData));

    if (typeof unfavouriteData !== "undefined")
      console.log(JSON.stringify(unfavouriteData));
  }, [
    favouriteData,
    favouriteLoading,
    favouriteError,
    unfavouriteData,
    unfavouriteError,
    unfavouriteLoading,
  ]);

  const [like, setLike] = useState("");
  useEffect(() => {
    const checkUserFav = recipeObj.favouritedByUsers.some(
      (obj) => obj.id === userId
    );
    setLike(checkUserFav);
  }, []);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div className="cursor-pointer" onClick={onOpen}>
        <Card className="relative group">
          <CardHeader className="pb-0 pt-3 px-3 m-2 flex-col items-start">
            <h4 className="font-bold text-lg">{recipeObj.name}</h4>
          </CardHeader>
          <CardBody className="p-3 justify-end position: static object-fit: cover">
            <a href="#">
              <Image
                isZoomed
                radius="lg"
                width="100%"
                alt="Card background"
                className="object-cover rounded-xl h-[200px] w-full"
                src={recipeObj.thumbnail_url}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </a>
          </CardBody>
          <CardFooter className="pt-0 px-3 mb-0 justify-between">
            <div className="grid-flow-row pb-1 space-y-0.5">
              <p
                className="mt-2 text-sm text-gray-500"
                style={{ alignSelf: "flex-end" }}
              >
                🕛 {recipeObj.time_taken_mins} mins
              </p>

              <p
                className="mt-2 text-sm text-gray-500"
                style={{ alignSelf: "flex-end" }}
              >
                🍽️ {recipeObj.serving} servings
              </p>
            </div>

            <Button
              isIconOnly
              color="danger"
              aria-label="Like"
              onClick={() => {
                setLike((value) => !value);
                like
                  ? handleUnfavouriteRecipe(recipeObj.id)
                  : handleFavouriteRecipe(recipeObj.id);
              }}
            >
              <HeartIcon filled={like} />
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="bg-gray-300">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p> </p>
                <p> </p>
                <p> </p>
                <p> </p>
                <p> </p>
                <p>
                  <Image
                    src={recipeObj.thumbnail_url}
                    alt={recipeObj.name}
                    style={{ width: "400px", height: "300px" }}
                  />
                </p>
                {recipeObj.name}
              </ModalHeader>
              <ModalBody>
                <p>Preparation Time:🕛 {recipeObj.time_taken_mins} mins</p>
                <ul>
                  <p>Ingredients:</p>
                  {recipeObj.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
                <p>Steps:</p>
                <p>{recipeObj.contents}</p>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
