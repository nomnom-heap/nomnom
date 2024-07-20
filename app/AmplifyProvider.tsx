"use client";
import { Amplify } from "aws-amplify";
// import config from "../amplify_outputs.json"; // uncomment for sandbox development

export function AmplifyProvider({ children }: { children: React.ReactNode }) {
  // Amplify.configure(config, { ssr: true }); // uncomment for sandbox development
  Amplify.configure(
    {
      Storage: {
        S3: {
          bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
          region: process.env.NEXT_PUBLIC_S3_BUCKET_REGION!,
        },
      },
      Auth: {
        Cognito: {
          loginWith: {
            email: true,
            // oauth: {
            //   providers: ["Google"],
            //   domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN!,
            //   responseType: "code",
            //   scopes: ["email"],
            //   redirectSignIn: ["http://localhost:3000"],
            //   redirectSignOut: ["http://localhost:3000"],
            // },
          },
          userPoolClientId:
            process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID!,
          userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
          identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID!,
          allowGuestAccess: true,
          signUpVerificationMethod: "code",
          passwordFormat: {
            minLength: 8,
            requireLowercase: true,
            requireUppercase: true,
            requireNumbers: true,
            requireSpecialCharacters: true,
          },
          userAttributes: {
            email: {
              required: true,
            },
          },
        },
      },
    },
    { ssr: true }
  );
  return <>{children}</>;
}
