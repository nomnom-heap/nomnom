"use client";
import "aws-amplify/auth/enable-oauth-listener";
import { getCurrentUser, fetchAuthSession, AuthUser } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [customState, setCustomState] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", async ({ payload }) => {
      console.log("payload", payload);
      switch (payload.event) {
        case "signInWithRedirect":
          getUser();
          console.log("current user", user);
          const session = await fetchAuthSession();
          console.log("session", session);
          console.log("id token", session?.tokens?.idToken);
          console.log("access token", session?.tokens?.accessToken);
          break;
      }
    });

    getUser();

    return unsubscribe;
  }, []);

  const getUser = async (): Promise<void> => {
    try {
      const currentUser = await getCurrentUser();
      console.log("GetUser current user", currentUser);
      setUser(currentUser);
      const session = await fetchAuthSession();
      // console.log("session", session);
      // console.log("id token", session?.tokens?.idToken);
      console.log("access token", session?.tokens?.accessToken.toString());
    } catch (error: any) {
      // console.error(error);
      switch (error.name) {
        case "UserUnAuthenticatedException":
          router.push("/login");
          break;

        default:
          break;
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2>Hello</h2>
    </div>
  );
}
