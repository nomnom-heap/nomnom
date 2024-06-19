import { defineFunction, secret } from "@aws-amplify/backend";

export const postConfirmation = defineFunction({
  name: "post-confirmation",
  environment: {
    NEO4J_URI: secret("NEO4J_URI"),
    NEO4J_USER: secret("NEO4J_USER"),
    NEO4J_PASSWORD: secret("NEO4J_PASSWORD"),
  },
});
