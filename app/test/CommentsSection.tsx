import { useState, useEffect } from "react";
import { CommentCard } from "../_components/CommentForm";
import CreateComment from "../_components/CreateComment";

interface Comment {
  id: string;
  username: string;
  avatarUrl: string;
  content: string;
  createdAt: string;
  likesCount: number;
}

const CommentsSection = ({ recipeId }: { recipeId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?recipeId=${recipeId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        console.error("Failed to fetch comments");
      }
    } catch (error) {
      console.error("An error occurred while fetching comments:", error);
    }
  };

  const handleLike = async (commentId: string) => {
    // Update the like count in the backend
    try {
      const response = await fetch(`/api/comments/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId }),
      });

      if (response.ok) {
        fetchComments(); // Refresh comments to update like counts
      } else {
        console.error("Failed to like comment");
      }
    } catch (error) {
      console.error("An error occurred while liking the comment:", error);
    }
  };

  return (
    <div>
      <CreateComment recipeId={recipeId} onCommentCreated={fetchComments} />
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          username={comment.username}
          avatarUrl={comment.avatarUrl}
          content={comment.content}
          createdAt={comment.createdAt}
          likesCount={comment.likesCount}
          onLike={() => handleLike(comment.id)}
        />
      ))}
    </div>
  );
};

export default CommentsSection;
