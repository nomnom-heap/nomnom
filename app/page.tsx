"use client";
import { Inter } from "next/font/google";
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  CardFooter,
} from "@nextui-org/react";
import { HeartIcon } from "./HeartIcon";
import { useQuery, useLazyQuery, ApolloProvider } from "@apollo/client";
import { Input, dataFocusVisibleClasses } from "@nextui-org/react";
import { getClient, query } from "@/_lib/apolloClient";
import { gql } from "@apollo/client/core";
import { Tabs, Tab } from "@nextui-org/react";
import { Checkbox, Button } from "@nextui-org/react";
import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
} from "@nextui-org/autocomplete";

import { Listbox, ListboxSection, ListboxItem } from "@nextui-org/react";
import { ListboxWrapper } from "./ListboxWrapper";
import { DeleteIcon } from "./DeleteIcon";
import { useState, useMemo } from "react";
import { SearchIcon } from "./SearchIcon";
import RootLayout from "./layout";
const inter = Inter({ subsets: ["latin"] });
const recipeData = [
  {
    contents: `
    1. Preheat the oven to 400°F (200°C).
    2. Wash and scrub the potatoes thoroughly. Pat them dry with paper towels.
    3. Pierce each potato several times with a fork to allow steam to escape during baking.
    4. Rub each potato with olive oil and sprinkle with salt.
    5. Place the potatoes directly on the oven rack and bake for about 45-60 minutes, or until they are tender when pierced with a fork.
    6. Once baked, remove the potatoes from the oven and let them cool slightly.
    7. Slice each potato open lengthwise and fluff the insides with a fork.
    8. Top each potato with butter, sour cream, shredded cheddar cheese, chopped chives, salt, and black pepper to taste.
    9. Serve immediately while hot.
  `,
    time_taken_mins: 60.0,
    name: "Baked Potatoes",
    ingredients: [
      "Potatoes",
      "Butter",
      "Sour cream",
      "Cheddar cheese",
      "Chives",
      "Salt",
      "Black Pepper",
    ],
    id: "dcea7ddf-13d1-43f9-8629-c9a391383122",
    thumbnail_url:
      "https://zardyplants.com/wp-content/uploads/2022/02/Vegan-Loaded-Baked-Potatoes-02.jpg",
  },

  {
    contents: `
      1. Cook the spaghetti according to package instructions until al dente. Reserve 1 cup of pasta water and then drain the pasta.
      2. In a large skillet, heat olive oil over medium heat. Add diced pancetta and cook until crispy. Add minced garlic and sauté for about 1 minute.
      3. In a bowl, whisk together the eggs and grated Parmesan cheese until well combined.
      4. Add the cooked spaghetti to the skillet with the pancetta. Toss to combine.
      5. Remove the skillet from heat and quickly pour in the egg and cheese mixture, tossing constantly to create a creamy sauce. Add reserved pasta water a little at a time until desired consistency is reached.
      6. Season with salt and black pepper to taste. Garnish with chopped parsley, if desired. Serve immediately.
    `,
    time_taken_mins: 30.0,
    name: "Spaghetti Carbonara",
    ingredients: [
      "Spaghetti",
      "Bacon",
      "Eggs",
      "Parmesan cheese",
      "Garlic",
      "Salt",
      "Black Pepper",
      "Olive Oil",
    ],
    id: "e5bd1e0d-c860-49ab-9020-a0a5818adf3e",
    thumbnail_url:
      "https://upload.wikimedia.org/wikipedia/commons/3/33/Espaguetis_carbonara.jpg",
  },
];
export default function HomePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ToggleSearch />
      <SortBar />
      <RecipeContainer />
    </>
  );
}

function ToggleSearch() {
  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Options">
        <Tab key="recipe_search" title="Search by Recipes">
          <RecipeSearchBar />
        </Tab>
        <Tab key="ingredient_search" title="Search by Ingredients">
          <IngredientSearchBar />
        </Tab>
      </Tabs>
    </div>
  );
}

function SortBar() {
  return (
    <div className="flex gap-4">
      <span>Sort by</span>
      <Checkbox size="md">Time Taken</Checkbox>
      <Checkbox size="md">Preparation Time</Checkbox>
    </div>
  );
}
const GET_INGREDIENTS_QUERY = gql`
  query MyQuery {
    ingredients {
      name
      value
    }
  }
`;

function IngredientSearchBar() {
  //create query to database to populate autocomplete items

  // const [ingredientSearchTerm, setIngredientSearchTerm] = useState("");

  const { data, loading, error } = useQuery(GET_INGREDIENTS_QUERY);

  const [ingredient, setIngredient] = useState([]);
  const handleSelectionChange = (selectedItem) => {
    if (!ingredient.includes(selectedItem) && selectedItem != null) {
      setIngredient([...ingredient, selectedItem]);
      console.log(ingredient);
    } else {
      console.log("duplicate");
    }
  };

  // const handleInputChange = (input) => {
  //   SEARCH_INGREDIENTS().then((result) => {
  //     console.log(result);
  //   });
  // };

  const [selectedKeys, setSelectedKeys] = useState(new Set(["text"]));

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
  );

  // const [ingredientToDelete, setIngredientDelete] = useState("");

  if (loading) {
    return <p> Loading ingredients... </p>;
  }
  const ingredients = data.ingredients;
  return (
    <>
      <Autocomplete
        // defaultItems={ingredients}
        label="Ingredients"
        placeholder="Search an ingredient"
        className="max-w-screen"
        disableSelectorIconRotation
        selectorIcon={<SearchIcon />}
        onSelectionChange={handleSelectionChange}
        // onInputChange={(input) =>
        //   getIngredients({ variables: { ingredientName: input } })
        // }
      >
        {ingredients.map((item) => (
          <AutocompleteItem key={item.value} value={item.value}>
            {item.name}
          </AutocompleteItem>
        ))}
        {/* {(ingredient) => <AutocompleteItem key={data}>{data}</AutocompleteItem>} */}
      </Autocomplete>

      {ingredient.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4>Ingredients so far</h4>
          <ListboxWrapper>
            <Listbox
              aria-label="Single selection example"
              variant="flat"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
            >
              {ingredient.map((x) => {
                let ingredientObj = ingredients.find((el) => el.value === x);

                return <ListboxItem key={x}>{ingredientObj.name}</ListboxItem>;
              })}
            </Listbox>
          </ListboxWrapper>
          <span>
            <Button
              isIconOnly
              color="danger"
              aria-label="Like"
              onClick={() => {
                setIngredient(ingredient.filter((i) => i !== selectedValue));
              }}
            >
              <DeleteIcon />
            </Button>
          </span>
        </div>
      )}
    </>
  );
}

const GET_RECIPES_QUERY = gql`
  query SearchRecipesByName($searchTerm: String!) {
    recipes(where: { name_CONTAINS: $searchTerm }) {
      name
      contents
      ingredients
      thumbnail_url
      time_taken_mins
    }
  }
`;
function RecipeSearchBar() {
  const [searchTerm, setSearchTerm] = useState("");

  const [getRecipe, { loading, error, data }] = useLazyQuery(GET_RECIPES_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error)
    return (
      <>
        <p>Error : {JSON.stringify(error, null, 4)}</p>
      </>
    );
  async function handleSubmit(e) {
    e.preventDefault();
    await getRecipe({ variables: { searchTerm: searchTerm } });
    return data;
  }
  console.log(data);
  //learn how to pass data into the recipe container

  return (
    <div className="max-w-screen">
      <form onSubmit={handleSubmit}>
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
          placeholder="Type to search..."
          startContent={
            <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
          }
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
    </div>
  );
}

function RecipeContainer() {
  return (
    <div className="flex space-x-4">
      {recipeData.map((recipe) => (
        <RecipeCard recipeObj={recipe} key={recipe.name} />
      ))}
    </div>
  );
}

function RecipeCard({ recipeObj }) {
  return (
    <Card className="p-4 w-80 h-26">
      <CardHeader className="pb-0 pt-2 px-4 m-2 flex-col items-start">
        <h4 className="font-bold text-large">{recipeObj.name}</h4>
      </CardHeader>
      <CardBody className="p-2 justify-end position: static object-fit: cover">
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
      <CardFooter className="justify-between">
        <p>Preparation time: {recipeObj.time_taken_mins} mins</p>
        <Button isIconOnly color="danger" aria-label="Like">
          <HeartIcon />
        </Button>
      </CardFooter>
    </Card>
  );
}
