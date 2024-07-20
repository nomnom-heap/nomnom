"use client";
import { useState, useEffect } from "react";
import { Checkbox, Input, Card, CardHeader, CardBody, CardFooter, Image, Button } from "@nextui-org/react";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAuth } from "../AuthProvider"; 
import { useQuery } from "@apollo/client";
import { GET_USER_RECIPES_QUERY } from "@/_lib/gql";
import LoadingSkeleton from "../_components/LoadingSkeleton";
import { SearchIcon } from "../_components/SearchIcon";
import IngredientDropdown, { IngredientOption } from "../_components/IngredientDropdown";

const LIMIT = 9;

export default function UserRecipesPage() {
  const [recipeSize, setRecipeSize] = useState("");
  const [windowIcon, setWindowIcon] = useState(<MdFullscreen />);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState<SearchTerm>({ recipeName: "", ingredients: [] });

  const { userId } = useAuth();
  const { data, loading, error, fetchMore } = useQuery(GET_USER_RECIPES_QUERY, {
    variables: { userId, limit: LIMIT, offset: 0 },
  });

  useEffect(() => {
    if (data) {
      setRecipes(data.recipes);
    }
  }, [data]);

  const setRecipeSizeHandler = () => {
    if (recipeSize === "") {
      setRecipeSize("size-full");
      setWindowIcon(<MdFullscreenExit />);
    } else {
      setRecipeSize("");
      setWindowIcon(<MdFullscreen />);
    }
  };

  const loadMoreRecipes = () => {
    fetchMore({
      variables: {
        offset: recipes.length,
      },
    }).then(({ data: moreData }) => {
      setRecipes([...recipes, ...moreData.recipes]);
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div className="max-w-screen flex flex-col gap-4">
        {/* Search recipe name input */}
        <Input
          label="Search"
          isClearable
          radius="lg"
          classNames={{
            label: "text-black/50 dark:text-white/90",
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "",
            inputWrapper: [],
          }}
          placeholder="Search for recipe name"
          startContent={
            <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
          }
          onChange={(e) => {
            setSearchTerm({ ...searchTerm, recipeName: e.target.value });
          }}
        />

        {/* Search recipe by ingredients */}
        <IngredientDropdown
          isMulti
          isClearable
          placeholder="Search for ingredient(s)"
          onChange={(newValue, actionMeta) => {
            newValue = newValue as IngredientOption[];
            setSearchTerm({
              ...searchTerm,
              ingredients: newValue.map((item) => item.value),
            });
          }}
        />
      </div>

      {/* Sortbar */}
      <div className="flex gap-4">
        <span>Sort by</span>
        <Checkbox size="md">Time Taken</Checkbox>
        <Checkbox size="md">Preparation Time</Checkbox>
      </div>

      {recipes.length === 0 ? (
        <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-4">
          {[...Array(LIMIT)].map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </div>
      ) : (
        <InfiniteScroll
          dataLength={recipes.length}
          next={loadMoreRecipes}
          hasMore={data.recipes.length % LIMIT === 0}
          loader={<LoadingSkeleton />}
          className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-4"
        >
          {recipes.map((recipe, index) => (
            <Card className={recipeSize} key={`${recipe.id}-${index}`}>
              <div className="ml-auto">
                <Button isIconOnly aria-label="Full screen" onClick={setRecipeSizeHandler}>
                  {windowIcon}
                </Button>
                <Button isIconOnly aria-label="Close Screen" color="danger">
                  <RxCross2 />
                </Button>
              </div>

              <CardHeader className="pb-0 pt-2 px-4 flex-col items-center justify-center">
                <Image
                  width={350}
                  src={recipe.thumbnail_url || "./images/placeholder.jpg"}
                  className="d-flex object-cover rounded-xl justify-content-center mx-auto"
                />
                <p>{recipe.name}</p>
                <p>{recipe.time_taken_mins} mins</p>
              </CardHeader>

              <CardBody>
                <div className="font-bold text-large">
                  Ingredients
                  <ul className="font-normal text-small list-disc">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-bold text-large">Steps</p>
                  <ol className="list-decimal">
                    {recipe.contents.split("\n").map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              </CardBody>

              <CardFooter>
                <div className="ml-auto">
                  {/* Add any footer content here */}
                </div>
              </CardFooter>
            </Card>
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
}
