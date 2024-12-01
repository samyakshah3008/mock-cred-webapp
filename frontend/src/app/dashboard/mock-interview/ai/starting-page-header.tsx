"use client";

import Lottie from "lottie-react";
import AIRobot from "../../../../../public/ai-interview-start.json";

const StartingPageHeader = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-48 m-auto">
        <Lottie animationData={AIRobot} loop={true} />
      </div>
      <div className="text-xs sm:text-base md:text-xl lg:text:3xl xl:text-4xl font-bold mt-2">
        Ready to start{" "}
        <span className="text-orange-500">Mock Interview with AI?</span>
      </div>
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base text-center mt-3 lg:w-[800px]">
        We wish you all the luck! Please note that since it's AI based mock
        interview, the model can make mistakes.
      </p>
    </div>
  );
};

export default StartingPageHeader;
