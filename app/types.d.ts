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

type Ingredient = {
  id: string;
  name: string;
};

type User = {
  id: string;
  display_name: string;
  email: string;
  recipes: Recipe[];
  favourite_recipes: Recipe[];
  following: User[];
  followers: User[];
};

type Recipe = {
  id: string;
  name: string;
  ingredients: string[];
  ingredients_qty: string[];
  serving: number;
  time_taken_mins: number;
  owner: User;
  favouritedByUsers: User[];
  thumbnail_url: string;
  contents: string;
  createdAt: string;
  updatedAt: string;
};
