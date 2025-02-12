"use client";

import SectionFour from "@/components/dashboard/profile/section-four";
import SectionOne from "@/components/dashboard/profile/section-one";
import SectionThree from "@/components/dashboard/profile/section-three";
import SectionTwo from "@/components/dashboard/profile/section-two";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const MainContainer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const currentUser = useSelector((state: any) => state?.user?.mockCredUser);

  useEffect(() => {
    if (!currentUser?._id) return;
    setIsLoading(false);
    setAvatarPreview(currentUser?.onboardingDetails?.stepTwo?.profilePicURL);
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader className="mr-2 h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-2 m-auto w-[80%]">
      <SectionOne email={currentUser?.email} />
      <SectionTwo
        profilePicURL={currentUser?.onboardingDetails?.stepTwo?.profilePicURL}
        avatarPreview={avatarPreview}
        setAvatarPreview={setAvatarPreview}
      />
      <SectionThree
        firstName={currentUser?.firstName}
        lastName={currentUser?.lastName}
        username={currentUser?.onboardingDetails?.stepOne?.username}
        aboutText={currentUser?.onboardingDetails?.stepTwo?.aboutText}
        role={currentUser?.role}
      />
      <SectionFour
        socialLinks={currentUser?.onboardingDetails?.stepFour?.socialLinks}
      />
    </div>
  );
};

export default MainContainer;
