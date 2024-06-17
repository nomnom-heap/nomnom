import React from "react";
import UserOwnedRecipes from "../View_Own_Recipe/page"; // Adjust the path if needed

const App = () => {
  const userId = "e7360194-e411-4ad3-97dc-5a1f832a80e5"; // Your specified user ID

  return (
    <div>
      <h1>User's Owned Recipes</h1>
      <UserOwnedRecipes userId={userId} />
    </div>
  );
};

export default App;