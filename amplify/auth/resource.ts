import { defineAuth, secret } from "@aws-amplify/backend";
import { postConfirmation } from "../functions/post-confirmation/resource";

export const auth = defineAuth({
  name: "nomnom-users",
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret("GOOGLE_CLIENT_ID"),
        clientSecret: secret("GOOGLE_CLIENT_SECRET"),
        scopes: ["EMAIL", "PROFILE"],
        attributeMapping: {
          email: "email",
          preferredUsername: "name",
          custom: {
            email_verified: "email_verified",
          },
        },
      },
      callbackUrls: ["http://localhost:3000"],
      logoutUrls: ["http://localhost:3000"],
    },
  },
  userAttributes: {
    preferredUsername: {
      mutable: true,
      required: false,
    },
  },
  triggers: {
    postConfirmation,
  },
});
