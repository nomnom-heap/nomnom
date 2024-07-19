import React from "react";
import UserOwnedRecipes from "../ViewOwnRecipe/page"; // Adjust the path if needed

const App = () => {
  const userId = "89fa054c-2071-7009-5a38-05265e229ccd"; // Your specified user ID

  return (
    <div>
      <h1>User's Owned Recipes</h1>
      <UserOwnedRecipes userId={userId} />
    </div>
  );
};

export default App;
