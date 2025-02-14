import {
  accessTokenKeyBrowserStorage,
  userIdKeyBrowserStorage,
} from "@/constants/browser-storage";
import { checkIfOnboardingCompletedOrNot } from "@/services/user.service";
import { getCookie } from "cookies-next";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MainContainer from "./main-container";

export const metadata: Metadata = {
  title: "Availability | MockCred",
  description: "Availability for MockCred Users.",
};

export default async function AvailabilityPage({}) {
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

  return <MainContainer />;
}
