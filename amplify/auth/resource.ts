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
  If a user attribute is marked as required, it cannot later be changed to not required.
  https://docs.amplify.aws/nextjs/build-a-backend/auth/concepts/user-attributes/ So, unless you really need the attribute for a functional reason, it's probably best to leave it as not required. As you can see in AuthenticatorClient, the Amplify Authenticator component can be customized to require various fields to be filled out at sign-up -- separately from the definition of attributes in Cognito.

  preferred_username isn't really a username: it doesn't have to be unique, and it can be changed. It doesn't really need to be stored in Cognito at all. But this is a convenient way to get the user to create one at the point of sign-up. We can use a Lambda function to keep it (and other values) in sync with DynamoDB.

  I'm mostly doing this to demonstrate how to add attributes for sign-up and then prompting the user to fill them in via the Authenticator component.

  Something like "catCount" *could* be stored in Cognito but it's probably not a good idea, as it's not really an authentication attribute. Also the number of cats you have might change frequently ¯\_(ツ)_/¯ 
  
  About custom attributes: https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html#user-pool-settings-custom-attributes

  Managing user attributes: https://docs.amplify.aws/nextjs/build-a-backend/auth/connect-your-frontend/manage-user-attributes/

  Commenting out (or removing) apparently does *not* remove the attribute from Cognito. I think this is a new addition to the docummentation: "User attributes that are used to identify your individual users (such as email and phone) cannot be renamed or deleted."

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
  //   // "custom:catCount": {
  //   //   dataType: "Number",
  //   //   mutable: true,
  //   // },
  // },
});
