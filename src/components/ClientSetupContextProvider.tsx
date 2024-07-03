"use client";

import { Amplify } from "aws-amplify";
import outputs from "@/../amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from "@aws-amplify/ui-react";
import { AdminContextProvider } from "@/context/AdminContext";

Amplify.configure(outputs, { ssr: true });

const ClientSetupContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Authenticator.Provider>
      <AdminContextProvider>{children}</AdminContextProvider>
    </Authenticator.Provider>
  );
};
export default ClientSetupContextProvider;
