"use client";
import { createContext, useContext, useState } from "react";

export interface PostDetails {
  changedFav: object[];
  changedFollow: object[];
}

export interface PostContextType {
  postDetails: PostDetails;
  setPostDetails: React.Dispatch<React.SetStateAction<PostDetails>>;
}

const PostContext = createContext<PostContextType | null>(null);

function PostProvider({ children }: { children: React.ReactNode }) {
  const [postDetails, setPostDetails] = useState<PostDetails>({
    changedFav: [],
    changedFollow: [],
  });

  return (
    <PostContext.Provider value={{ postDetails, setPostDetails }}>
      {children}
    </PostContext.Provider>
  );
}

export { PostContext, PostProvider };
