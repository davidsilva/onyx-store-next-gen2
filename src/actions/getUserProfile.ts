import { cookieBasedClient } from "@/utils/amplify-utils";
import { checkIsAuthenticated } from "@/utils/amplify-utils";

export interface UserProfileData {
  id: string;
  userId: string;
  username: string;
  preferredUsername: string;
  email: string;
  givenName: string;
  middleName?: string;
  familyName: string;
  birthdate: string;
}

export const getUserProfile = async (
  userId: string
): Promise<UserProfileData | null> => {
  console.log("UserProfile userId", userId);
  const isSignedIn = await checkIsAuthenticated();
  console.log("isSignedIn", isSignedIn);
  let userProfileData: UserProfileData | null = null;

  try {
    const { data, errors } =
      await cookieBasedClient.models.UserProfile.listUserProfileByUserId(
        {
          userId: userId,
        },
        {
          authMode: isSignedIn ? "userPool" : "iam",
        }
      );

    console.log("data", data);
    console.log("errors", errors);

    if (errors) {
      console.error("errors", errors);
      return null;
    }

    if (data.length === 0) {
      console.error("No data found");
      return null;
    }

    userProfileData = data[0] as UserProfileData;
  } catch (error) {
    console.error("error", error);
    return null;
  }

  return userProfileData;
};
