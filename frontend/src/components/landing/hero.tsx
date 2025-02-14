"use client";

import { IconBrandGithub } from "@tabler/icons-react";
import Lottie from "lottie-react";
import { useRouter } from "next/navigation";
import LandingPageDart from "../../../public/landing-page-dart.json";
import { Button } from "../ui/button";
import { Highlight } from "../ui/hero-highlight";

function Hero({ isAuthenticated }: any) {
  const router = useRouter();
  return (
    <main className="container mx-auto px-6 pt-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-[200px] m-auto">
          <Lottie
            animationData={LandingPageDart}
            loop={true}
            width={200}
            height={200}
          />
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight font-bricolage">
          Practice Mock Interviews and build proof of work with
          <span className=" text-orange-500"> MockCred! </span>
        </h1>
        <p className="text-base md:text-lg text-gray-600">
          Free, open source forever, aims to help you prepare for interviews and
          is a win-win situation for both interviewee and interviewers!
          <br />
          <Highlight>topmate alternative for mock interviews</Highlight>
        </p>

        <div className="my-6 flex flex-wrap justify-center gap-4">
          <Button
            onClick={() => {
              if (isAuthenticated) {
                router.push("/dashboard");
              } else {
                router.push("/signup");
              }
            }}
            size="lg"
          >
            {isAuthenticated ? "Go to Dashboard 🚀" : "Get Started 🚀"}
          </Button>
          <Button
            onClick={() => {
              if (!window) return;
              window.open(
                "https://github.com/samyakshah3008/mock-cred-webapp",
                "_blank"
              );
            }}
            size="lg"
            variant="secondary"
          >
            <IconBrandGithub className="mr-2" />
            View on GitHub
          </Button>
        </div>
      </div>
    </main>
  );
}

export default Hero;
