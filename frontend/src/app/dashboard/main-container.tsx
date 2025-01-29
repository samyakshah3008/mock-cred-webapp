"use client";

import Header from "@/components/dashboard/header";
import QuickStart from "@/components/dashboard/quick-start";
import { Separator } from "@/components/ui/separator";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const MainContainer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  const currentUser = useSelector((state: any) => state?.user?.mockCredUser);

  const sections = [<Header />, <QuickStart />];

  useEffect(() => {
    if (!currentUser?._id) return;
    setIsLoading(false);
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader className="mr-2 h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 p-4">
      {sections.map((section, id) => {
        return (
          <>
            {section}
            {id < sections.length - 1 ? <Separator /> : null}
          </>
        );
      })}
    </div>
  );
};

export default MainContainer;
