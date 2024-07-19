import CommentsSection from "./CommentsSection";

const TestPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Recipe Comments</h1>
      <CommentsSection recipeId="23834dd3-ff92-4780-bb22-a585b85777f7" />
    </div>
  );
};

export default TestPage;