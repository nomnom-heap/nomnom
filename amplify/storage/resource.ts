import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "nomnom-images-drive",
  access: (allow) => ({
    "public/*": [
      allow.guest.to(["get", "write"]),
      allow.authenticated.to(["write"]),
    ],
  }),
});
