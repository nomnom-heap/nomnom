"use client";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { confirmSignUp } from "aws-amplify/auth";

function ConfirmSignUpForm() {
  const searchParams = useSearchParams();
  const email = decodeURIComponent(searchParams.get("email") ?? "");
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const router = useRouter();

  const handleConfirmSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: email,
        confirmationCode: confirmationCode,
      });

      if (isSignUpComplete) {
        router.push("/login");
      }
    } catch (error: any) {
      switch (error.name) {
        case "CodeMismatchException":
          setErrorMsg("Invalid verification code provided, please try again.");
          break;
        case "ExpiredCodeException":
          setErrorMsg("Verification code has expired, please try again.");
          break;
        default:
          setErrorMsg(error.message);
          break;
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <form onSubmit={handleConfirmSignUp}>
        <Card className="max-w-full w-[340px] h-auto p-2">
          <CardHeader className="flex-col items-start">
            <h4 className="font-bold text-large">Confirm your email address</h4>
            <p className="text-small">
              Enter the email confirmation code sent to {email}
            </p>
          </CardHeader>
          <CardBody className="flex-col gap-4 items-center">
            <Input
              label="Confirmation Code"
              placeholder="Enter the confirmation code"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
            />
            <Button className="w-auto" color="primary" type="submit">
              Lets get this started 🔥
            </Button>
          </CardBody>
          {errorMsg && (
            <p className="text-center text-small text-red-500">{errorMsg}</p>
          )}
        </Card>
      </form>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmSignUpForm />
    </Suspense>
  );
}
