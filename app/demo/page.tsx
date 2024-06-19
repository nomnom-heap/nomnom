"use client";
import { gql, useMutation } from "@apollo/client";
import { FormEvent, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

const CREATE_RECIPE_MUTATION = gql`
  mutation createRecipe($name: String!, $userId: ID!) {
    createRecipes(
      input: {
        name: $name
        ingredients: ["ingredient1", "ingredient2"]
        ingredients_qty: ["1 tbsp", "500g"]
        serving: 5
        time_taken_mins: 30
        thumbnail_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=3600"
        contents: "some content"
        owner: { connect: { where: { node: { id: $userId } } } }
      }
    ) {
      info {
        nodesCreated
        relationshipsCreated
      }
      recipes {
        id
        name
        owner {
          id
          display_name
        }
      }
    }
  }
`;

export default function Page() {
  const [recipeName, setRecipeName] = useState("");

  const [createRecipe, { data, loading, error }] = useMutation(
    CREATE_RECIPE_MUTATION
  );

  if (loading) return <p>Loading...</p>;
  if (error)
    return (
      <>
        <p>Error : {JSON.stringify(error, null, 4)}</p>
      </>
    );

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    try {
      const session = await fetchAuthSession();
      const userId = session?.tokens?.accessToken.payload.sub;
      await createRecipe({
        variables: { name: recipeName, userId: userId },
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Recipe name"
          onChange={(e) => setRecipeName(e.target.value)}
        />
        <button type="submit">Create Recipe</button>
      </form>
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </div>
  );
}
