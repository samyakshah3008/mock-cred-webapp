"use client";

import Header from "@/components/common/header";
import LogoutSection from "@/components/dashboard/profile/logout-section";
import SectionFive from "@/components/dashboard/profile/section-five";
import SectionFour from "@/components/dashboard/profile/section-four";
import SectionOne from "@/components/dashboard/profile/section-one";
import SectionThree from "@/components/dashboard/profile/section-three";
import SectionTwo from "@/components/dashboard/profile/section-two";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SettingsHeader from "../../../../public/settings-header.png";

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
    <div className="flex flex-col gap-10 p-4">
      <Header
        type="image"
        img={SettingsHeader}
        headerText="Manage your"
        headerHighlightText="account"
        description="Welcome to Settings page, here you can edit all the information which will be displayed on your public profile page. So make sure you are up-to-date with your information."
      />
      <div className="flex flex-col gap-4 w-[90%] xl:w-[70%] m-auto">
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
          prefilledLinks={currentUser?.onboardingDetails?.stepFour?.socialLinks}
        />
        <SectionFive
          prefilledTechnicalDetails={currentUser?.onboardingDetails?.stepFive}
        />

        <LogoutSection />
      </div>
    </div>
  );
};

export default MainContainer;
