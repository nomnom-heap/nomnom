"use client";
import { createContext, useContext, useState } from "react";

export interface PostDetails {
  changedFav: { id: string; like: boolean }[];
  changedFollow: { id: string; follow: boolean }[];
}

export interface PostContextType {
  postDetails: PostDetails;
  setPostDetails: React.Dispatch<React.SetStateAction<PostDetails>>;
}

// @ts-ignore
const PostContext = createContext<PostContextType>(null);

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
