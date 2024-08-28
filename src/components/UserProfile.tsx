import { cookieBasedClient } from "@/utils/amplify-utils";
import { checkIsAuthenticated } from "@/utils/amplify-utils";
import { type Schema } from "@/../amplify/data/resource";

// type UserProfileDataType = Schema["UserProfile"];

// type UserProfileForDisplayType = Omit<
//   UserProfileDataType,
//   "reviews" | "updatedAt" | "createdAt" | "profileOwner" | "profilePicture"
// >;

const UserProfile = async ({ id }: { id: string }) => {
  const isSignedIn = await checkIsAuthenticated();
  let userProfileData;

  try {
    const { data, errors } = await cookieBasedClient.models.UserProfile.get(
      { id: id },
      {
        authMode: isSignedIn ? "userPool" : "iam",
        selectionSet: [
          "id",
          "userId",
          "username",
          "preferredUsername",
          "email",
          "givenName",
          "middleName",
          "familyName",
          "birthdate",
        ],
      }
    );
    console.log("data", data);
    console.log("errors", errors);
    userProfileData = data;
  } catch (error) {
    console.error("error", error);
  }
  return (
    <>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">User Profile</h1>
      <ul>
        {userProfileData &&
          Object.entries(userProfileData).map(([key, value]) => (
            <li key={key}>
              <strong>{key}</strong>: {value || "N/A"}
            </li>
          ))}
      </ul>
    </>
  );
};
export default UserProfile;
