"use client";

import Lottie from "lottie-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashboardWitch from "../../../public/witch-dashboard.json";
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";

import { useToast } from "@/hooks/use-toast";
import {
  getCurrentYear,
  getDaysUntilYearEnd,
  getTimeOfDay,
} from "@/utils/helper-functions";
import {
  IconArrowElbowRight,
  IconCopy,
  IconCopyCheck,
} from "@tabler/icons-react";
import { Button } from "../ui/button";
import { getHeaderTextBasedOnRole } from "./helper";

type Word = {
  text: string;
  className?: string;
};

const Header = () => {
  const currentUser = useSelector((state: any) => state?.user?.mockCredUser);
  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/${currentUser?.onboardingDetails?.stepOne?.username}`
      );
      setCopied(true);

      toast({
        description: "Link copied to clipboard!",
      });

      setTimeout(() => setCopied(false), 5000);
    } catch (err) {
      toast({
        description: "Failed to copy link.",
        variant: "destructive",
      });
    }
  };

  const navigateToPublicPageHandler = () => {
    if (window) {
      window.open(
        `/${currentUser?.onboardingDetails?.stepOne?.username}`,
        "_blank"
      );
    }
  };

  useEffect(() => {
    if (!currentUser?._id) return;
    setWords([
      {
        text: "Meowgical",
      },
      {
        text: `${getTimeOfDay()},`,
      },
      {
        text: `${currentUser?.firstName}!`,
        className: "text-orange-500 dark:text-orange-500",
      },
    ]);
    setIsLoading(false);
  }, [currentUser]);

  if (!words?.length || isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader className="mr-2 h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-[300px] h-[300px]">
        <Lottie
          animationData={DashboardWitch}
          loop={true}
          width={200}
          height={200}
        />
      </div>
      <TypewriterEffectSmooth words={words} />
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base w-[80%] text-center">
        Each new fresh day is an opportunity, you have {getDaysUntilYearEnd()}{" "}
        fresh opportunities till {getCurrentYear()} ends.{" "}
        {getHeaderTextBasedOnRole(currentUser?.role)}
      </p>
      <div className="mt-6 flex gap-2">
        <Button onClick={navigateToPublicPageHandler}>
          {" "}
          View Public Page <IconArrowElbowRight size={16} />
        </Button>
        <Button variant="outline" onClick={handleCopy}>
          {copied ? <IconCopyCheck size={16} /> : <IconCopy size={16} />}
          <span className="ml-2">Copy Public Page Link</span>
        </Button>
      </div>
    </div>
  );
};

export default Header;
