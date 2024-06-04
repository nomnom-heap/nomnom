import { signIn } from "@/auth";

export function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("cognito");
      }}
    >
      <button type="submit">Signin with Cognito</button>
    </form>
  );
}
