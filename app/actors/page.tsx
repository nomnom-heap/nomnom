"use client";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import CreateActorForm from "../_components/CreateActorForm";

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

const GET_ACTOR_BY_ID = gql`
  query GetActorById($id: ID!) {
    actors(where: { id: $id }) {
      id
      name
      actedInMovies {
        id
        title
      }
    }
  }
`;

const GET_MOVIES = gql`
  query GetMovies {
    movies {
      id
      title
    }
  }
`;

const GET_MOVIE_BY_ID = gql`
  query GetMovieById($id: ID!) {
    movies(where: { id: $id }) {
      id
      title
    }
  }
`;

const ADD_ACTOR_TO_MOVIE = gql`
  mutation AddActorToMovie($actorId: ID!, $movieId: ID!) {
    updateActors(
      where: { id: $actorId }
      connect: { actedInMovies: { where: { node: { id: $movieId } } } }
    ) {
      info {
        relationshipsCreated
        nodesCreated
      }
      actors {
        id
        name
        actedInMovies {
          id
          title
        }
      }
    }
  }
`;

export default function Page() {
  const {
    data: actorsData,
    loading: actorsLoading,
    error: actorsError,
  } = useQuery(GET_ACTORS);

  const [
    getActorById,
    { data: actorData, loading: actorLoading, error: actorError },
  ] = useLazyQuery(GET_ACTOR_BY_ID);

  const {
    data: moviesData,
    loading: moviesLoading,
    error: moviesError,
  } = useQuery(GET_MOVIES);

  const [
    getMovieById,
    { data: movieData, loading: movieLoading, error: movieError },
  ] = useLazyQuery(GET_MOVIE_BY_ID);

  const [
    addActorToMovie,
    {
      data: addActorToMovieData,
      loading: addActorToMovieLoading,
      error: addActorToMovieError,
    },
  ] = useMutation(ADD_ACTOR_TO_MOVIE);

  if (actorsLoading || moviesLoading || actorLoading)
    return <div>Loading...</div>;
  if (addActorToMovieLoading) return <div>Add Actor To Movie Loading...</div>;

  if (actorsError) return <div>Actors Error: {actorsError.message}</div>;
  if (moviesError) return <div>Movies Error: {moviesError.message}</div>;
  if (actorError) return <div>Actor Error: {actorError.message}</div>;
  if (addActorToMovieError)
    return <div>Add Actor To Movie Error: {addActorToMovieError.message}</div>;

  return (
    <>
      <div className="flex flex-row gap-4">
        <div>
          <h1>Actors</h1>
          <select
            onChange={(e) => {
              getActorById({ variables: { id: e.target.value } });
            }}
          >
            {actorsData.actors.map((actor: Actor) => (
              <option key={actor.id} value={actor.id}>
                {actor.name}
              </option>
            ))}
          </select>
          {actorData?.actors[0]?.name && (
            <div>
              <h2>Selected Actor: {actorData?.actors[0]?.name}</h2>
              <h3>Acted in movies:</h3>
              <ul>
                {actorData?.actors[0]?.actedInMovies.map((movie: Movie) => (
                  <li key={movie.id}>{movie.title}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Movies */}
        <div>
          <h1>Movies</h1>
          <select
            onChange={(e) => {
              getMovieById({ variables: { id: e.target.value } });
            }}
          >
            {moviesData.movies.map((movie: Movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>
          {movieData?.movies[0]?.title && (
            <p>Selected Movie: {movieData?.movies[0]?.title}</p>
          )}
        </div>

        <div className="">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={() => {
              addActorToMovie({
                variables: {
                  actorId: actorData?.actors[0]?.id,
                  movieId: movieData?.movies[0]?.id,
                },
              });
            }}
          >
            Add actor to movie
          </button>

          {addActorToMovieData?.updateActors?.info?.relationshipsCreated > 0 ? (
            <div>
              <h2>Relationships created:</h2>
              <p>
                {addActorToMovieData.updateActors.info.relationshipsCreated}
              </p>

              <h2>Actor details</h2>
              <p>
                {JSON.stringify(addActorToMovieData.updateActors.actors[0])}
              </p>
            </div>
          ) : (
            <p>No relationships created</p>
          )}
        </div>

        {/* Create Actor Form */}
      </div>
      <CreateActorForm />
    </>
  );
}

