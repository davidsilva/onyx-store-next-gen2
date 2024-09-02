import { getUserProfile, UserProfileData } from "@/actions/getUserProfile";

interface UserProfilePageProps {
  params: { id: string };
}

const UserProfilePage = async ({ params }: UserProfilePageProps) => {
  const userProfileData = await getUserProfile(params.id);
  console.log("userProfileData", userProfileData);
  if (!userProfileData) {
    return <p>User not found</p>;
  }
  return (
    <div>
      <h1>User Profile</h1>
      <p>
        <strong>Username:</strong> {userProfileData.preferredUsername}
      </p>
      <p>
        <strong>Email:</strong> {userProfileData.email}
      </p>
      {/* preferredUsername: string; email: string; givenName: string;
      middleName?: string; familyName: string; birthdate: string; */}
      <p>
        <strong>First Name: </strong>
        {userProfileData.givenName}
      </p>
      <p>
        <strong>Middle Name: </strong>
        {userProfileData.middleName}
      </p>
      <p>
        <strong>Last Name: </strong>
        {userProfileData.familyName}
      </p>
      <p>
        <strong>Birthdate: </strong>
        {userProfileData.birthdate}
      </p>
    </div>
  );
};

export default UserProfilePage;
