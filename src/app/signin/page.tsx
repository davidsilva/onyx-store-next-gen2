import AuthClient from "../../components/AuthenticatorClient";
import { checkIsAuthenticated } from "../../utils/amplify-utils";

const SignIn = async () => {
  const isSignedIn = await checkIsAuthenticated();

  if (isSignedIn) {
    return (
      <div className="flex mt-10">
        <div className="w-1/2 border border-black rounded p-20 mx-auto text-xl">
          You are signed in.
        </div>
      </div>
    );
  }

  return <AuthClient />;
};

export default SignIn;
