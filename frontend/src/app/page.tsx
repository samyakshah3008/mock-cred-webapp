import Features from "@/components/landing/features";
import Footer from "@/components/landing/footer";
import Hero from "@/components/landing/hero";
import Navbar from "@/components/landing/navbar";
import SpecialMessage from "@/components/landing/special-message";
import { accessTokenKeyBrowserStorage } from "@/constants/browser-storage";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

export default function Home() {
  const accessToken: any = getCookie(accessTokenKeyBrowserStorage, { cookies });
  console.log(accessToken, "accesstoken from server");
  let isAuthenticated = false;
  if (accessToken?.toString().length > 0) {
    isAuthenticated = true;
  }

  return (
    <div>
      <Navbar isAuthenticated={isAuthenticated} />
      <Hero isAuthenticated={isAuthenticated} />
      <Features />
      <SpecialMessage />
      <Footer />
    </div>
  );
}
