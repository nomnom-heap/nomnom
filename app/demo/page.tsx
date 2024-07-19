"use client";
import { gql, useMutation } from "@apollo/client";
import { FormEvent, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

const CREATE_RECIPE_MUTATION = gql`
  mutation createRecipe($name: String!, $userId: ID!) {
    createRecipes(
      input: {
        name: $name
        contents: """
        1. Preheat the oven to 400°F (200°C).
        2. Wash and scrub the potatoes thoroughly. Pat them dry with paper towels.
        3. Pierce each potato several times with a fork to allow steam to escape during baking.
        4. Rub each potato with olive oil and sprinkle with salt.
        5. Place the potatoes directly on the oven rack and bake for about 45-60 minutes, or until they are tender when pierced with a fork.
        6. Once baked, remove the potatoes from the oven and let them cool slightly.
        7. Slice each potato open lengthwise and fluff the insides with a fork.
        8. Top each potato with butter, sour cream, shredded cheddar cheese, chopped chives, salt, and black pepper to taste.
        9. Serve immediately while hot.
        """
        time_taken_mins: 60.0
        ingredients: [
          "Potatoes"
          "Butter"
          "Sour cream"
          "Cheddar cheese"
          "Chives"
          "Salt"
          "Black Pepper"
        ]
        ingredients_qty: [
          "4 large"
          "4 tbsp"
          "1/2 cup"
          "1 cup, shredded"
          "2 tbsp, chopped"
          "to taste"
          "to taste"
        ]
        thumbnail_url: "https://zardyplants.com/wp-content/uploads/2022/02/Vegan-Loaded-Baked-Potatoes-02.jpg"
        owner: { connect: { where: { node: { id: $userId } } } }
        serving: 4.0
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
