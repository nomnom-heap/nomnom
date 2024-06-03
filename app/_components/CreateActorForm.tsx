"use client";
import { FormEvent, useState } from "react";
import { gql, useMutation } from "@apollo/client";

const CREATE_ACTOR_MUTATION = gql`
  mutation CreateActorMutation($name: String!) {
    createActors(input: { name: $name }) {
      info {
        nodesCreated
      }
      actors {
        id
        name
      }
    }
  }
`;

export default function CreateActorForm() {
  const [actorName, setActorName] = useState("");

  // Pass mutation to useMutation
  const [createActor, { data, loading, error }] = useMutation(
    CREATE_ACTOR_MUTATION
  );

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    await createActor({ variables: { name: actorName } });
  }

  return (
    <div>
      <p>Create actor:</p>
      <form onSubmit={handleSubmit}>
        <input
          className="border-2 border-gray-300 rounded-md p-2"
          type="text"
          value={actorName}
          onChange={(e) => setActorName(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
          Create
        </button>
      </form>
      {data?.createActors?.info?.nodesCreated > 0 ? (
        <>
          <p>{data.createActors.actors[0].name} created.</p>
          <p>{JSON.stringify(data.createActors.actors[0])}</p>
        </>
      ) : null}
    </div>
  );
}
