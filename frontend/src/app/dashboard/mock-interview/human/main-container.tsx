"use client";

import Header from "@/components/common/header";
import FindMatchSection from "@/components/dashboard/mock-interview-human/find-match-section";
import { getHeaderTextBasedOnRole } from "@/components/dashboard/mock-interview-human/helper";
import { Separator } from "@/components/ui/separator";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import HumanMockInterviewHeaderLottie from "../../../../../public/human-interview-header.json";

const MainContainer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<any>(null);

  const currentUser = useSelector((state: any) => state?.user?.mockCredUser);

  const changeActiveRole = () => {
    if (userRole == "interviewee") {
      setUserRole("interviewer");
    } else {
      setUserRole("interviewee");
    }
  };

  const sections = [
    <Header
      LottieImg={HumanMockInterviewHeaderLottie}
      headerTextLeft="Find people for"
      headerHighlightText="mock interviews"
      description={getHeaderTextBasedOnRole(currentUser?.role)}
      type="lottie"
      isLottieOnLoop={false}
    />,
    <FindMatchSection
      userRole={userRole}
      currentUser={currentUser}
      changeActiveRole={changeActiveRole}
    />,
  ];

  useEffect(() => {
    if (!currentUser?._id) return;
    setIsLoading(false);
    if (
      currentUser?.role == "allrounder" ||
      currentUser?.role == "interviewer"
    ) {
      setUserRole("interviewer");
    } else {
      setUserRole("interviewee");
    }
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
