import { defineAuth } from "@aws-amplify/backend";
import { postConfirmation } from "./post-confirmation/resource";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  triggers: {
    postConfirmation,
  },
  groups: ["Admins", "Users"],
  /*   
  https://docs.amplify.aws/nextjs/build-a-backend/auth/concepts/user-attributes/
  */
  // userAttributes: {
  //   preferredUsername: {
  //     mutable: true,
  //     required: false,
  //   },
  //   givenName: {
  //     mutable: true,
  //     required: false,
  //   },
  //   middleName: {
  //     mutable: true,
  //     required: false,
  //   },
  //   familyName: {
  //     mutable: true,
  //     required: false,
  //   },
  //   birthdate: {
  //     mutable: true,
  //     required: false,
  //   },
  // },
});
