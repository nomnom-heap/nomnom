import { getClient, query } from "@/_lib/apolloClient";
import { gql } from "@apollo/client/core";

const GET_ACTORS = gql`
  query GetActors {
    actors {
      id
      name
      actedInMovies {
        id
        title
      }
    }
  }
`;

export default async function Home() {
  // const { data } = await getClient().query({ query: userQuery });
  // `query` is a shortcut for `getClient().query`
  const { data } = await query({ query: GET_ACTORS });

  return (
    <div className="flex flex-col items-center">
      <h2>All Actors</h2>
      <table className="table-auto">
        <thead>
          <tr>
            <th>Actor ID</th>
            <th>Actor Name</th>
            <th>Movies Acted In</th>
          </tr>
        </thead>
        <tbody>
          {data?.actors?.map((actor: Actor) => (
            <tr key={actor.id}>
              <td>{actor.id}</td>
              <td>{actor.name}</td>
              <td>
                {actor.actedInMovies
                  .map((movie: Movie) => movie.title)
                  .join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
