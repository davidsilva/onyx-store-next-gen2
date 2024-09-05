import { getUserProfile } from "@/actions/getUserProfile";
import { getReviewsForUserProfile } from "@/actions/getReviewsForUserProfile";
import ReviewItem from "@/components/ReviewItem";

interface UserProfilePageProps {
  params: { id: string };
}

const UserProfilePage = async ({ params }: UserProfilePageProps) => {
  const userProfileData = await getUserProfile(params.id);
  console.log("userProfileData", userProfileData);
  if (!userProfileData) {
    return <p>User not found</p>;
  }

  const reviews = await getReviewsForUserProfile(params.id);
  console.log("reviews", reviews);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
      <p>
        <strong>Username:</strong> {userProfileData.preferredUsername}
      </p>
      <p>
        <strong>Email:</strong>{" "}
        {userProfileData.email || "Visible only to profile owner"}
      </p>
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
      <h2 className="text-2xl font-bold text-gray-800">
        Reviews by {userProfileData.preferredUsername}
      </h2>
      {!reviews || reviews.length === 0 ? (
        <p>No reviews yet</p>
      ) : (
        <div>
          {reviews.map((review) => (
            <div key={review.id}>
              <ReviewItem
                review={review}
                currentUser={{ userId: userProfileData.userId }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
