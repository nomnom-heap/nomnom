import React, { useState } from "react";
import UserOwnedRecipes from "../ViewOwnRecipe/page";
import RecipeInputModal from "./RecipeInputModal"; 

const App = () => {
  const userId = "89fa054c-2071-7009-5a38-05265e229ccd"; 
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const handleEditClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setEditModalOpen(true);
  };

  return (
    <div>
      <h1>User's Owned Recipes</h1>
      <UserOwnedRecipes userId={userId} onEditClick={handleEditClick} />
      {selectedRecipe && (
        <RecipeInputModal
          isOpen={isEditModalOpen}
          onOpenChange={() => setEditModalOpen(false)}
          recipe={selectedRecipe}
        />
      )}
    </div>
  );
};

export default App;
