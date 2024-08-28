"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import { Text } from "@aws-amplify/ui-react";

const formFields = {
  signUp: {
    preferred_username: {
      label: "Username (required)",
      placeholder: "Choose a username",
      isRequired: true,
      order: 1,
    },
    given_name: {
      label: "First Name",
      placeholder: "Enter your first name",
      isRequired: false,
      order: 2,
    },
    middle_name: {
      label: "Middle Name",
      placeholder: "Enter your middle name",
      isRequired: false,
      order: 3,
    },
    family_name: {
      label: "Last Name",
      placeholder: "Enter your last name",
      isRequired: false,
      order: 4,
    },
    birthdate: {
      label: "Birthdate",
      placeholder: "Enter your birthdate",
      isRequired: false,
      order: 5,
    },
  },
};

const components = {
  SignUp: {
    Header() {
      return (
        <Text textAlign="center">
          Only a username is required. Choose anything you want. We just use it
          in the UI to make it look friendlier.
        </Text>
      );
    },
  },
};

const AuthClient = () => {
  return <Authenticator formFields={formFields} components={components} />;
};

export default AuthClient;
