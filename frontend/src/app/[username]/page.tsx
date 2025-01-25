import { notFound } from "next/navigation";
import { getUserByUsername } from "./helper";
import MainContainer from "./main-container";

interface UserProfileProps {
  params: { username: string };
  searchParams: { tab: string };
}

export async function generateMetadata({ params }: any) {
  const user = await getUserByUsername(params.username);

  if (!user) {
    return {
      title: "User Not Found",
    };
  }

  return {
    title: `${user?.firstName}'s Profile | MockCred`,
    description: `Book an event with ${user?.firstName}. View available public events and schedules.`,
  };
}

const UserProfile = async ({ params, searchParams }: UserProfileProps) => {
  const { username } = params;
  const tab = searchParams.tab || "statistics";

  const user: any = await getUserByUsername(username);
  if (user?.statusCode == 404) {
    notFound();
  }

  return <MainContainer user={user} tab={tab} username={username} />;
};

export default UserProfile;
