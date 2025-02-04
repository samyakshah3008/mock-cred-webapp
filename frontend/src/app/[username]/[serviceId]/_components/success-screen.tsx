"use client";

import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import { useRouter } from "next/navigation";
import LottieImg from "../../../../../public/checkmark-success.json";

const SuccessScreen = () => {
  const router = useRouter();
  return (
    <div className="bg-white flex items-center justify-center mt-20">
      <div className="flex flex-col items-center">
        <div className="w-64 m-auto">
          <Lottie animationData={LottieImg} loop={false} />
        </div>
        <div className="text-xs sm:text-base md:text-xl lg:text-3xl xl:text-5xl font-bold text-center">
          Interview booked{" "}
          <span className="text-orange-500">Successfully!</span>
        </div>
        <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base text-center mt-3 lg:w-[800px]">
          We expect you to be on time and prepared for the interview to mutually
          respect each other's time. We have also sent you emails for the same.
        </p>
        <div className="border-yellow-500 border-2 rounded-md p-2 text-sm text-center mt-5 lg:w-[600px] bg-yellow-200 ">
          Please note that, once your interview is completed - don't forget to
          approve it and ask your mate to approve yours. Because until interview
          is not approved, that won't be counted in your public profile
          aggregated statistics.{" "}
        </div>
        <Button
          className="mt-5 underline"
          variant="link"
          onClick={() => router.push("/dashboard/bookings")}
        >
          Check this interview's booking details
        </Button>
      </div>
    </div>
  );
};

export default SuccessScreen;
