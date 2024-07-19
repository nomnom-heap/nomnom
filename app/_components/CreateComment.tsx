import { useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { useAuth } from "../AuthProvider";

interface CreateCommentProps {
  recipeId: string;
  onCommentCreated: (comment: any) => void; 
}

const CreateComment: React.FC<CreateCommentProps> =  ({ recipeId, onCommentCreated }: CreateCommentProps) => {
  const [comment, setComment] = useState("");
  const { userId, setUserId } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try{
      const session = await fetchAuthSession();
      const userId = session?.tokens?.accessToken.payload.sub;
      try {
        const response = await fetch("/api/comments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: comment, recipeId, userId: userId }),
        });

        if (response.ok) {
          setComment(""); // Clear the comment input
          onCommentCreated(); // Refresh the comments section
        } else {
          console.error("Failed to create comment");
        }
      } catch (error) {
        console.error("An error occurred while creating the comment:", error);
      }
    }catch (error: any) {
      console.error(error.message);
      console.error("cannot create", error);
    };

    if (!userId){
      return null;
    }

    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="border rounded-md p-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600"
        >
          Submit Comment
        </button>
      </form>
    );
  };
};

export default CreateComment;