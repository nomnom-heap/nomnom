type Actor = {
  id: string;
  name: string;
  actedInMovies: Movie[];
};

type Movie = {
  id: string;
  title: string;
  actorsActedIn: Actor[];
};
