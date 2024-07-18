"use client";
import { useDisclosure } from "@nextui-org/react";
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  CardFooter,
  Button,
  Avatar,
} from "@nextui-org/react";
import { HeartIcon } from "./HeartIcon";
import {
  MutableRefObject,
  SetStateAction,
  useEffect,
  useState,
  useRef,
} from "react";
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
import { IoConstructOutline } from "react-icons/io5";
import { FaGalacticSenate } from "react-icons/fa";

type RecipeCardProps = {
  recipe: Recipe;
  onPress?: () => void;
  peopleYouFollow: Object[];
  setPeopleYouFollow: React.Dispatch<React.SetStateAction<Object[]>>;
  setMutatedFavourite: React.Dispatch<React.SetStateAction<object[]>>;
  mutatedFavourite: object[];
  searchIngredients: string[];
  // setPeopleYouFollow:
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

// const { token } = useAuth();
// followedInfo.forEach((item) => console.log(`followedInfo: ${item}`));
// console.log(followedInfo);
// console.log("test : ${[].some((e) => e === "some");

const FOLLOW_USER_MUTATION = gql`
  mutation FollowUser($userId: ID!, $userToFollowId: ID!) {
    updateUsers(
      where: { id: $userId }
      connect: { following: { where: { node: { id: $userToFollowId } } } }
    ) {
      info {
        relationshipsCreated
      }
    }
  }
`;

const UNFOLLOW_USER_MUTATION = gql`
  mutation UnfollowUser($userId: ID!, $userToUnfollowId: ID!) {
    updateUsers(
      where: { id: $userId }
      disconnect: { following: { where: { node: { id: $userToUnfollowId } } } }
    ) {
      info {
        relationshipsDeleted
      }
    }
  }
`;

export function RecipeCard({
  recipe,
  onPress,
  peopleYouFollow,
  setPeopleYouFollow,
  setMutatedFavourite,
  mutatedFavourite,
  searchIngredients,
}: RecipeCardProps) {
  // const { token } = useAuth();
  // followedInfo.forEach((item) => console.log(`followedInfo: ${item}`));
  // console.log(followedInfo);
  // console.log("test : ${[].some((e) => e === "some");
  const [missingIngredients, setMissingIngredients] = useState<String[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const userId = useAuth().userId;
  // console.log(userId);

  useEffect(() => {
    if (userId) {
      setIsLoggedIn(true);
    }
  }, [userId]);

  // const { token } = useAuth();
  // followedInfo.forEach((item) => console.log(`followedInfo: ${item}`));
  // console.log(followedInfo);
  // console.log("test : ${[].some((e) => e === "some");

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

  const [
    followUser,
    {
      loading: followUserLoading,
      error: followUserError,
      data: followUserData,
    },
  ] = useMutation(FOLLOW_USER_MUTATION);

  const [
    unfollowUser,
    {
      loading: unfollowUserLoading,
      error: unfollowUserError,
      data: unfollowUserData,
    },
  ] = useMutation(UNFOLLOW_USER_MUTATION);

  async function handleFavouriteRecipe(recipeId: string) {
    const session = await fetchAuthSession();
    const userId = session?.tokens?.accessToken.payload.sub;

    setMutatedFavourite([
      ...mutatedFavourite.filter((recipe) => recipe.id !== recipeId),
      { id: recipeId, like: true },
    ]);

    await favouriteRecipe({
      variables: { recipeId: recipeId, userId: userId },
    });
  }

  async function handleUnfavouriteRecipe(recipeId: string) {
    const session = await fetchAuthSession();
    const userId = session?.tokens?.accessToken.payload.sub;
    setMutatedFavourite([
      ...mutatedFavourite.filter((recipe) => recipe.id !== recipeId),
      { id: recipeId, like: false },
    ]);
    await unfavouriteRecipe({
      variables: { recipeId: recipeId, userId: userId },
    });
  }

  async function handleFollowUser(userToFollowId: string) {
    try {
      setPeopleYouFollow((prevsPeopleYouFollow) => [
        ...prevsPeopleYouFollow,
        { __typename: "User", id: userToFollowId },
      ]);

      const session = await fetchAuthSession();
      const userId = session?.tokens?.accessToken.payload.sub;
      await followUser({
        variables: { userToFollowId: userToFollowId, userId: userId },
      });
    } catch (error) {
      console.error("Error occurred: ", error.message);
    }
  }

  async function handleUnfollowUser(userToUnfollowId: string) {
    try {
      setPeopleYouFollow((prevsPeopleYouFollow) =>
        prevsPeopleYouFollow.filter((obj) => obj.id !== userToUnfollowId)
      );
      const session = await fetchAuthSession();
      const userId = session?.tokens?.accessToken.payload.sub;
      await unfollowUser({
        variables: { userToUnfollowId: userToUnfollowId, userId: userId },
      });
    } catch (error) {
      console.error("Error occurred: ", error.message);
    }
  }

  const [favourited, setFavourited] = useState<boolean>(
    userId
      ? (!mutatedFavourite.some((obj) => obj.id === recipe.id) &&
          recipe.favouritedByUsers.some((obj) => obj.id === userId)) ||
          mutatedFavourite.some(
            (obj) => obj.id === recipe.id && obj.like === true
          )
      : false
  );

  const [isFollowed, setIsFollowed] = useState<boolean>(
    peopleYouFollow
      ? peopleYouFollow.some((obj) => obj.id === recipe.owner.id)
      : false
  );

  useEffect(() => {
    if (peopleYouFollow) {
      const isUserFollowed = peopleYouFollow.some(
        (obj) => obj.id === recipe.owner.id
      );
      setIsFollowed(isUserFollowed);
    }
  }, [peopleYouFollow]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (!searchIngredients) {
      setMissingIngredients([]);
      return;
    }

    const newMissingIngredients = recipe.ingredients.filter(
      (recipeIngredient) => {
        return (
          !searchIngredients.some((searchedIngredient) =>
            recipeIngredient.includes(searchedIngredient.trim())
          ) && recipeIngredient.trim() !== ""
        );
      }
    );

    setMissingIngredients(newMissingIngredients);
  }, [recipe.ingredients, searchIngredients]);

  return (
    <>
      <div className="cursor-pointer" onClick={onOpen} key={recipe.id}>
        <Card className="relative group" shadow="sm">
          <CardHeader className="pb-0 pt-3 px-3 m-2 flex-col items-start">
            <div className="flex place-items-center justify-between w-full pr-2 pl-0">
              <div className="flex gap-3 place-items-center">
                <Avatar
                  isBordered
                  radius="full"
                  size="md"
                  showFallback
                  src=""
                />
                <h4 className="text-sm font-semibold leading-none text-default-600">
                  {recipe.owner.display_name}
                </h4>
              </div>
              {!isLoggedIn ? (
                ""
              ) : userId === recipe.owner.id ? (
                ""
              ) : (
                <Button
                  color="primary"
                  radius="full"
                  size="sm"
                  variant={isFollowed ? "bordered" : "solid"}
                  onPress={() => {
                    isFollowed
                      ? handleUnfollowUser(recipe.owner.id)
                      : handleFollowUser(recipe.owner.id);
                    setIsFollowed(!isFollowed);
                  }}
                >
                  {isFollowed ? "Unfollow" : "Follow"}
                </Button>
              )}
            </div>

            <div className="pt-4">
              <h4 className="font-bold text-md">{recipe.name}</h4>
            </div>
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
              {searchIngredients?.length === 0 ? (
                ""
              ) : missingIngredients?.length === 0 ? (
                <p
                  className="text-sm text-green-500"
                  style={{ alignSelf: "flex-end" }}
                >
                  You have all ingredients 😊
                </p>
              ) : (
                <p
                  className="text-sm text-red-500"
                  style={{ alignSelf: "flex-end" }}
                >
                  You lack {missingIngredients.length} ingredients 😔
                </p>
              )}
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

            {isLoggedIn ? (
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
            ) : (
              ""
            )}
          </CardFooter>
        </Card>
      </div>
      <RecipeModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        recipe={recipe}
        peopleYouFollow={peopleYouFollow}
        setPeopleYouFollow={setPeopleYouFollow}
        setMutatedFavourite={setMutatedFavourite}
        mutatedFavourite={mutatedFavourite}
        searchIngredients={searchIngredients}
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
