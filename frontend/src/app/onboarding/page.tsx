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
  title: "Onboarding",
  description: "Onboarding for MockCred Users.",
};

export default async function OnboardingPage({}) {
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

  if (checkUserOnboardedResponse?.isOnboardingComplete) {
    redirect("/dashboard");
  }

  return <MainContainer />;
}
