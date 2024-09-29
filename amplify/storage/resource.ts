import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "onyxStoreNextGen2Bucket",
  access: (allow) => ({
    "product-images/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read"]),
      allow.groups(["Admins"]).to(["read", "write", "delete"]),
    ],
  }),
});
/* 
This access definition will add the environment variable myReports_BUCKET_NAME to the function. This environment variable can be accessed on the env object. Grant access to other resources: https://docs.amplify.aws/react/build-a-backend/functions/grant-access-to-other-resources/
 */
