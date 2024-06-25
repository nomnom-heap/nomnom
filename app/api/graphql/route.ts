// Next.js Custom Route Handler: https://nextjs.org/docs/app/building-your-application/routing/router-handlers
import { neoSchema } from "@/app/_lib/neoSchema";
import { createYoga } from "graphql-yoga";

const { handleRequest } = createYoga({
  schema: await neoSchema.getSchema(),

  // While using Next.js file convention for routing, we need to configure Yoga to use the correct endpoint
  graphqlEndpoint: "/api/graphql",
  context: async ({ request }) => ({
    token: request.headers.get("authorization"),
  }),

  // Yoga needs to know how to create a valid Next response
  fetchAPI: { Response },
});

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};
