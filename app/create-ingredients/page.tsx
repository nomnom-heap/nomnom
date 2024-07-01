"use client";
import { gql, useMutation } from "@apollo/client";
import { ingredients } from "../data";
import { Button } from "@nextui-org/react";
import { useState } from "react";

const CREATE_INGREDIENT_MUTATION = gql`
  mutation createIngredient($name: String!) {
    createIngredients(input: { name: $name }) {
      info {
        nodesCreated
      }
    }
  }
`;

export default function Page() {
  const [createIngredient, { data, loading, error }] = useMutation(
    CREATE_INGREDIENT_MUTATION
  );
  const [ingredientCount, setIngredientCount] = useState(0);

  const createIngredients = async () => {
    for (const ingredient of ingredients) {
      await createIngredient({ variables: { name: ingredient.label } });
      setIngredientCount(ingredientCount + 1);
    }
  };

  return (
    <>
      <Button onPress={createIngredients}>Create ingredient</Button>
      {ingredientCount} ingredients created
    </>
  );
}
