import {
  accessTokenKeyBrowserStorage,
  userIdKeyBrowserStorage,
} from "@/constants/browser-storage";
import { checkIfOnboardingCompletedOrNot } from "@/services/user.service";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MainContainer from "./main-container";

interface UserProfileProps {
  params: { username: string; serviceId: string };
}

const ServicePage = async ({ params }: UserProfileProps) => {
  const accessToken = await getCookie(accessTokenKeyBrowserStorage, {
    cookies,
  });
  if (!accessToken) {
    redirect("/signin");
  }

  const userId: any = await getCookie(userIdKeyBrowserStorage, { cookies });

  const checkUserOnboardedResponse = await checkIfOnboardingCompletedOrNot(
    userId
  );

  // check if onboarding completed or not

  if (!checkUserOnboardedResponse?.isOnboardingComplete) {
    redirect("/onboarding");
  }

  const { username, serviceId } = params;

  return <MainContainer username={username} eventURL={serviceId} />;
};

export default ServicePage;
