"use client";
import { Button, Listbox, ListboxItem } from "@nextui-org/react";
import { useQuery } from "@apollo/client";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { SearchIcon } from "./SearchIcon";
import { DeleteIcon } from "./DeleteIcon";
import { ListboxWrapper } from "./ListboxWrapper";
import { useState, useMemo } from "react";
import { gql, useLazyQuery } from "@apollo/client";
const GET_INGREDIENTS_QUERY = gql`
  query MyQuery {
    ingredients {
      name
      value
    }
  }
`;
export function IngredientSearchBar() {
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
