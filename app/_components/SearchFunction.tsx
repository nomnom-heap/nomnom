"use client";
import { Input, Tabs, Tab } from "@nextui-org/react";
import { SearchIcon } from "./SearchIcon";
import { useState } from "react";
import { IngredientSearchBar } from "./IngredientSearchBar";
import { FORMERR } from "dns";

export function SearchFunction({ onSearchRecipe }) {
  const [searchTerm, setSearchTerm] = useState("");

  function titleCase(str) {
    const splitStr = str.toLowerCase().split(" ");
    for (let i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(" ");
  }

  async function handleChange(searchTerm) {
    //try and catch results in the disappearance of the UI?? Why
    const sanitizedSearchTerm = titleCase(searchTerm);
    // e.preventDefault();
    onSearchRecipe(sanitizedSearchTerm);
  }
  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Options">
        <Tab key="recipe_search" title="Search by Recipes">
          <div className="max-w-screen">
            <form>
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
                onChange={(e) => {
                  handleChange(e.target.value);
                }}
              />
            </form>
          </div>
        </Tab>
        <Tab key="ingredient_search" title="Search by Ingredients">
          <IngredientSearchBar />
        </Tab>
      </Tabs>
    </div>
  );
}
