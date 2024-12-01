"use client";

import Lottie from "lottie-react";
import AIRobot from "../../../../../public/ai-interviewer.json";

const Header = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-96 m-auto">
        <Lottie animationData={AIRobot} loop={true} />
      </div>
      <div className="text-xs sm:text-base md:text-xl lg:text:3xl xl:text-4xl font-bold mt-2">
        Polish your skills with
        <span className="text-orange-500"> AI Mock Interview!</span>
      </div>
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base text-center mt-3 lg:w-[800px]">
        Test your Interview skills with AI by turning on camera and microphone
        to practice and polish yourself before appearing for real interview!{" "}
      </p>
    </div>
  );
};

export default Header;
