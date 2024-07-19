import CommentsSection from "./CommentsSection";

const TestPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Recipe Comments</h1>
      <CommentsSection recipeId="recipe1" />
    </div>
  );
};

export default TestPage;