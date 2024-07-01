"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "aws-amplify/auth";

type AuthContextType = {
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const { userId } = await getCurrentUser();
        setUserId(userId);
      } catch (error) {
        setUserId(null);
      }
    }
    // console.log("running useEffect in AuthProvider, fetching user");
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
