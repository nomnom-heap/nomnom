"use client";
import { gql, useMutation } from "@apollo/client";
import { data } from "@/_data/supercook_ingredients";
import { Button } from "@nextui-org/react";
import { useState } from "react";

const CREATE_INGREDIENT_MUTATION = gql`
  mutation createIngredient($name: String!, $group: String) {
    createIngredients(input: { name: $name, group: $group }) {
      info {
        nodesCreated
      }
    }
  }
`;

export default function Page() {
  const [createIngredient] = useMutation(CREATE_INGREDIENT_MUTATION);

  const createIngredients = async () => {
    for (const group of data) {
      for (const ingredient of group.ingredients) {
        const { data: createIngredientData } = await createIngredient({
          variables: {
            name: ingredient.toLowerCase(),
            group: group.group_name,
          }, // ingredient name to be lower case for neo4j text index to match
        });
        console.log(createIngredientData);
      }
    }
  };

  return (
    <>
      <Button onPress={createIngredients}>Create ingredient</Button>
    </>
  );
}
