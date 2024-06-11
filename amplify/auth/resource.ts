import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
  name: "nomnom-users",

  loginWith: {
    email: true,
  },
  userAttributes: {
    preferredUsername: {
      mutable: true,
      required: false,
    },
  },
});
