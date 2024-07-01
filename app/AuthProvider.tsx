"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const session = await fetchAuthSession();
        const token = session?.tokens?.accessToken.toString();
        setAccessToken(token || null);
      } catch (error) {
        setAccessToken(null);
      }
    }
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
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
