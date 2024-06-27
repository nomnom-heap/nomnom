"use client";
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  CardFooter,
  Button,
} from "@nextui-org/react";
import { HeartIcon } from "./HeartIcon";

export function RecipeCard({
  recipeObj,
  onFavouriteRecipe,
  userId,
  onUnfavouriteRecipe,
}) {
  console.log(userId);
  console.log(recipeObj.id);
  return (
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
          onClick={
            recipeObj.favouritedByUsers.some((obj) => obj.id === userId)
              ? () => onUnfavouriteRecipe(recipeObj.id)
              : () => onFavouriteRecipe(recipeObj.id)
          }
        >
          <HeartIcon
            filled={recipeObj.favouritedByUsers.some(
              (obj) => obj.id === userId
            )}
          />
        </Button>
      </CardFooter>
    </Card>
  );
}
