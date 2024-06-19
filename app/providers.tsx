"use client";

import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";

import { HttpLink } from "@apollo/client";
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";
import { setContext } from "@apollo/client/link/context";
import { fetchAuthSession } from "aws-amplify/auth";
import { Amplify } from "aws-amplify";
// import config from "../amplify_outputs.json"; // uncomment for sandbox development

// have a function to create a client for you
function makeClient() {
  const httpLink = new HttpLink({
    // this needs to be an absolute url, as relative urls cannot be used in SSR
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
    // you can disable result caching here if you want to
    // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
    fetchOptions: { cache: "no-store" },
    // you can override the default `fetchOptions` on a per query basis
    // via the `context` property on the options passed as a second argument
    // to an Apollo Client data fetching hook, e.g.:
    // const { data } = useSuspenseQuery(MY_QUERY, { context: { fetchOptions: { cache: "force-cache" }}});
  });

  const authLink = setContext(async (_, { headers }) => {
    // get the authentication token from local storage if it exists
    try {
      const session = await fetchAuthSession();
      const accessToken = session?.tokens?.accessToken.toString();
      // console.log("access token in provider", accessToken);
      return {
        headers: {
          ...headers,
          authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
      };
    } catch (error) {
      console.error(error);
      console.log(
        "Unable to fetch access token in provider. User not signed in"
      );
    }

    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
      },
    };
  });

  // use the `ApolloClient` from "@apollo/experimental-nextjs-app-support"
  return new ApolloClient({
    // use the `InMemoryCache` from "@apollo/experimental-nextjs-app-support"
    cache: new InMemoryCache(),
    // link: httpLink,
    link: authLink.concat(httpLink),
  });
}

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // Amplify.configure(config); // uncomment for sandbox development

  Amplify.configure({
    Auth: {
      Cognito: {
        loginWith: {
          email: true,
          oauth: {
            providers: ["Google"],
            domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN!,
            responseType: "code",
            scopes: ["email"],
            redirectSignIn: ["http://localhost:3000"],
            redirectSignOut: ["http://localhost:3000"],
          },
        },
        userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID!,
        userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
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
  });

  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      <NextUIProvider navigate={router.push}>{children}</NextUIProvider>
    </ApolloNextAppProvider>
  );
}
