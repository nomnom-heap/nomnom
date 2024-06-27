import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "recipe-images-drive",
  access: (allow) => ({
    "public/*": [allow.guest.to(["get"]), allow.authenticated.to(["write"])],
  }),
});
