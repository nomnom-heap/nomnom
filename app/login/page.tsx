"use client";

import React, { Key, useState } from "react";
import {
  Tabs,
  Tab,
  Input,
  Link,
  Button,
  Card,
  CardBody,
} from "@nextui-org/react";
import { signUp, signIn, signInWithRedirect } from "aws-amplify/auth";
import { useRouter } from "next/navigation";

export default function Page() {
  const [selected, setSelected] = useState<Key>("login");
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const encodedSignUpEmail = encodeURIComponent(signUpEmail);
    try {
      const { isSignUpComplete, nextStep } = await signUp({
        username: signUpEmail,
        password: signUpPassword,
        options: {
          userAttributes: {
            preferred_username: signUpUsername,
          },
        },
      });

      if (isSignUpComplete) {
        setErrorMsg("You have an existing account. Please log in.");
      }

      // redirect to confirm sign up page if nextStep is confirm sign up
      if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
        router.push(`/confirm-sign-up?email=${encodedSignUpEmail}`);
      }
    } catch (error: any) {
      console.error(error);
      // error object has name and message fields
      switch (error.name) {
        case "UsernameExistsException":
          setErrorMsg(`An account with email ${signUpEmail} already exists.`);
          break;
        case "InvalidPasswordException":
          setErrorMsg(error.message);
          break;
        case "EmptySignUpUsername":
          setErrorMsg("Email is required");
          break;
        case "InvalidParameterException":
          setErrorMsg("Username is required");
          break;
        default:
          setErrorMsg(error.message);
          break;
      }
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { isSignedIn, nextStep } = await signIn({
        username: loginEmail,
        password: loginPassword,
      });
      if (isSignedIn) {
        // router.push("/");
        window.location.replace("/");
      } else if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
        const email = encodeURIComponent(loginEmail);
        router.push(`/confirm-sign-up?email=${email}`);
      }
    } catch (error: any) {
      console.error(error);
      switch (error.name) {
        case "UserAlreadyAuthenticatedException":
          router.push("/");
          break;
        case "EmptySignInUsername":
          setErrorMsg("Email is required");
          break;
        case "EmptySignInPassword":
          setErrorMsg("Password is required");
          break;
        case "NotAuthorizedException":
          setErrorMsg("Incorrect username or password.");
          break;
        default:
          setErrorMsg(error.message);
          break;
      }
    }
  };

  const handleLoginWithGoogle = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      await signInWithRedirect({
        provider: "Google",
      });
    } catch (error: any) {
      console.error(error);
      switch (error.name) {
        case "UserAlreadyAuthenticatedException":
          router.push("/");
          break;
        default:
          setErrorMsg(error.message);
          break;
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <Card className="max-w-full w-[340px] h-auto p-2">
        <CardBody className="overflow-hidden">
          <Tabs
            fullWidth
            size="md"
            aria-label="Tabs form"
            selectedKey={selected as string}
            onSelectionChange={setSelected}
          >
            <Tab key="login" title="Login">
              <form
                className="flex flex-col gap-4"
                onSubmit={handleLoginWithGoogle}
              >
                <Button className="mb-4" color="secondary" type="submit">
                  Login with Google
                </Button>
              </form>

              <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                <Input
                  isRequired
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <Input
                  isRequired
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <p className="text-center text-small">
                  Need to create an account?{" "}
                  <Link size="sm" onPress={() => setSelected("sign-up")}>
                    Sign up
                  </Link>
                </p>
                <div className="flex gap-2 justify-end">
                  <Button fullWidth color="primary" type="submit">
                    Login
                  </Button>
                </div>
              </form>
              {errorMsg && (
                <p className="text-center text-small text-red-500 mt-4">
                  {errorMsg}
                </p>
              )}
            </Tab>
            <Tab key="sign-up" title="Sign up">
              <form
                className="flex flex-col gap-4 h-[300px]"
                onSubmit={handleSignUp}
              >
                <Input
                  isRequired
                  label="Username"
                  placeholder="Enter your username"
                  type="text"
                  value={signUpUsername}
                  onChange={(e) => setSignUpUsername(e.target.value)}
                />
                <Input
                  isRequired
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                />
                <Input
                  isRequired
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                />
                <p className="text-center text-small">
                  Already have an account?{" "}
                  <Link size="sm" onPress={() => setSelected("login")}>
                    Login
                  </Link>
                </p>
                <div className="flex gap-2 justify-end">
                  <Button fullWidth color="primary" type="submit">
                    Sign up
                  </Button>
                </div>
              </form>
              {errorMsg && (
                <p className="text-center text-small text-red-500">
                  {errorMsg}
                </p>
              )}
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
