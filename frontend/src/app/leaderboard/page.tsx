import { accessTokenKeyBrowserStorage } from "@/constants/browser-storage";
import { getCookie } from "cookies-next";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MainContainer from "./main-container";

export const metadata: Metadata = {
  title: "Leaderboard | MockCred",
  description: "Services for MockCred Users.",
};

export default async function ServicesPage({}) {
  const accessToken = await getCookie(accessTokenKeyBrowserStorage, {
    cookies,
  });
  if (!accessToken) {
    redirect("/signin");
  }

  return <MainContainer />;
}
