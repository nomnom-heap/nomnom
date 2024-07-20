"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Image,
  Button,
  Avatar,
} from "@nextui-org/react";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { RecipeCard } from "./RecipeCard";
import useSearchRecipes from "../_hooks/useSearchRecipes";
import { useAuth } from "../AuthProvider";
import useFollowUsers from "../_hooks/useFollowUsers";
import toast from "react-hot-toast";
import useDeleteRecipe from "../_hooks/useDeleteRecipe";

const Editor = dynamic(() => import("@/app/_components/BlockNoteEditor"), {
  ssr: false,
});

type RecipeModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
  recipe: Recipe;
  missingIngredients: string[];
  onOpenEditRecipeModal: (open: boolean) => void;
};

const LIMIT = 7;

export default function RecipeModal({
  recipe,
  isOpen,
  onOpenChange,
  missingIngredients,
  onOpenEditRecipeModal,
}: RecipeModalProps) {
  const { userId } = useAuth();

  const { recipes: recRecipes, setSearchTerm: setRecRecipesIngredients } =
    useSearchRecipes(LIMIT);
  const [isOwner, setIsOwner] = useState(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(
    recipe.owner.followers.some((follower) => follower.id === userId)
  ); // TODO: can be optimized to check if user is following the recipe owner instead

  const {
    followUser,
    followUserError,
    followUserData,
    unfollowUser,
    unfollowUserError,
    unfollowUserData,
  } = useFollowUsers();

  const {
    deleteRecipe,
    data: deleteRecipeData,
    error: deleteRecipeError,
  } = useDeleteRecipe();

  async function handleFollowUser() {
    await followUser({
      variables: { userToFollowId: recipe.owner.id, userId: userId },
    });
  }

  async function handleUnfollowUser() {
    await unfollowUser({
      variables: { userToUnfollowId: recipe.owner.id, userId: userId },
    });
  }

  const handleDeleteRecipe = async () => {
    if (!recipe) {
      return;
    }
    await deleteRecipe({
      variables: {
        recipeId: recipe.id,
      },
    });
  };

  useEffect(() => {
    if (!followUserData) return;
    if (followUserData.updateUsers.info.relationshipsCreated > 0) {
      setIsFollowing(true);
    }
  }, [followUserData]);

  useEffect(() => {
    if (followUserError) {
      toast.error("Oops! An error occured when trying to follow user");
      console.error("follow user error", followUserError);
    }
    if (unfollowUserError) {
      toast.error("Oops! An error occured when trying to unfollow user");
      console.error("unfollow user error", unfollowUserError);
    }
    if (deleteRecipeError) {
      toast.error("Oops! An error occured when trying to delete recipe");
      console.error("delete recipe error", deleteRecipeError);
    }
  }, [followUserError, unfollowUserError, deleteRecipeError]);

  useEffect(() => {
    if (!unfollowUserData) return;
    if (unfollowUserData.updateUsers.info.relationshipsDeleted > 0) {
      setIsFollowing(false);
    }
  }, [unfollowUserData]);

  useEffect(() => {
    if (deleteRecipeData) {
      toast.success("Recipe deleted!", { position: "top-right" });
    }
  }, [deleteRecipeData]);

  useEffect(() => {
    if (userId === recipe.owner.id) {
      setIsOwner(true);
    }
    setRecRecipesIngredients({
      recipeName: "",
      ingredients: recipe.ingredients,
    });
  }, []);

  return (
    <Modal
      scrollBehavior="inside"
      className="h-auto xs:min-w-full sm:min-w-fit"
      isOpen={isOpen}
      placement="center"
      onOpenChange={onOpenChange}
    >
      <ModalContent className="bg-white h-auto">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-row items-center justify-between">
              <p>{recipe.name}</p>
              {!isOwner && (
                <div className="flex flex-row items-center gap-4 mr-8">
                  <Avatar size="md" showFallback />
                  <span className="text-sm font-semibold leading-none whitespace-nowrap overflow-hidden text-ellipsis">
                    {recipe.owner.display_name}
                  </span>
                  <Button
                    color="primary"
                    radius="full"
                    size="sm"
                    variant={isFollowing ? "bordered" : "solid"}
                    onPress={() => {
                      isFollowing ? handleUnfollowUser() : handleFollowUser();
                    }}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                </div>
              )}
            </ModalHeader>
            <ModalBody>
              <div className="flex items-center justify-center">
                <Image
                  className="rounded-xl"
                  src={
                    recipe.thumbnail_url
                      ? recipe.thumbnail_url
                      : "/image_placeholder.png"
                  }
                  alt="Recipe thumbnail image"
                  style={{ width: "400px", height: "300px" }}
                />
              </div>

              <div className="flex flex-col gap-2 w-auto">
                <div className="flex flex-col gap-2 items-left">
                  {missingIngredients.length > 0 ? (
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
              <div>
                <hr />
                <p className="font-bold py-3">You might like:</p>

                {recRecipes.length > 0 ? (
                  <div className="grid xs:grid-cols-1 sm:grid-cols-2 gap-4">
                    {recRecipes.map((r) => {
                      if (r.id === recipe.id) return;
                      return (
                        <RecipeCard
                          recipe={r}
                          key={`${r.id}-${r.name}`}
                          searchIngredients={recipe.ingredients}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <span>No recipes found 😅 Consider creating one!</span>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              {/* If user is recipe owner, show edit and delete button */}
              {isOwner && (
                <div className="flex flex-row gap-4">
                  <Button onPress={() => onOpenEditRecipeModal(true)}>
                    Edit
                  </Button>
                  <Button color="danger" onPress={handleDeleteRecipe}>
                    Delete
                  </Button>
                </div>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
