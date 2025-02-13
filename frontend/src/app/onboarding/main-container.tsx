"use client";

import StackedCard from "@/components/onboarding/stacked-card-steps";
import StepFive from "@/components/onboarding/step-five";
import StepFour from "@/components/onboarding/step-four";
import StepOne from "@/components/onboarding/step-one";
import StepThree from "@/components/onboarding/step-three";
import StepTwo from "@/components/onboarding/step-two";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { defaultAvailability } from "../dashboard/calendar/constants";

const MainContainer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingDetailsObj, setOnboardingDetailsObj] = useState({
    stepOne: {
      socialAccountLink: "",
      username: "",
      howDoUserPlanToUseApp: "",
    },
    stepTwo: {
      aboutText: "",
      profilePicURL: "",
    },
    stepThree: {
      availability: defaultAvailability,
    },
    stepFour: {
      socialLinks: {
        linkedIn: "",
        github: "",
        X: "",
        instagram: "",
        peerlist: "",
      },
    },
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const currentUser = useSelector((state: any) => state?.user?.mockCredUser);

  const preFillOnboardingDetails = () => {
    if (!currentUser?.onboardingDetails?.stepOne) {
      setOnboardingStep(0);
    } else if (!currentUser?.onboardingDetails?.stepTwo) {
      setOnboardingStep(1);
      setOnboardingDetailsObj({
        ...onboardingDetailsObj,
        stepOne: currentUser?.onboardingDetails?.stepOne,
      });
    } else if (!currentUser?.onboardingDetails?.stepThree) {
      setOnboardingStep(2);
      setOnboardingDetailsObj({
        ...onboardingDetailsObj,
        stepOne: currentUser?.onboardingDetails?.stepOne,
        stepTwo: currentUser?.onboardingDetails?.stepTwo,
      });
      setAvatarPreview(currentUser?.onboardingDetails?.stepTwo?.profilePicURL);
    } else if (!currentUser?.onboardingDetails?.stepFour?.linkedIn) {
      setOnboardingStep(3);
      setOnboardingDetailsObj({
        ...onboardingDetailsObj,
        stepOne: currentUser?.onboardingDetails?.stepOne,
        stepTwo: currentUser?.onboardingDetails?.stepTwo,
        stepThree: currentUser?.onboardingDetails?.stepThree,
      });
    } else if (!currentUser?.onboardingDetails?.stepFive?.position) {
      setOnboardingStep(4);
      setOnboardingDetailsObj({
        ...onboardingDetailsObj,
        stepOne: currentUser?.onboardingDetails?.stepOne,
        stepTwo: currentUser?.onboardingDetails?.stepTwo,
        stepThree: currentUser?.onboardingDetails?.stepThree,
        stepFour: currentUser?.onboardingDetails?.stepFour,
      });
    }
  };

  useEffect(() => {
    if (!currentUser?._id) return;
    setIsLoading(false);
    preFillOnboardingDetails();
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader className="mr-2 h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed gradient-bg-onboarding inset-0 h-[100dvh] flex justify-center items-center p-6 md:p-4 overflow-hidden">
      Main Container
      <StackedCard selectedIndex={onboardingStep}>
        <StepOne
          setOnboardingStep={setOnboardingStep}
          onboardingDetailsObj={onboardingDetailsObj}
          setOnboardingDetailsObj={setOnboardingDetailsObj}
        />
        <StepTwo
          setOnboardingStep={setOnboardingStep}
          onboardingDetailsObj={onboardingDetailsObj}
          setOnboardingDetailsObj={setOnboardingDetailsObj}
          avatarPreview={avatarPreview}
          setAvatarPreview={setAvatarPreview}
        />
        <StepThree
          setOnboardingStep={setOnboardingStep}
          onboardingDetailsObj={onboardingDetailsObj}
        />
        <StepFour
          onboardingDetailsObjSocialLinks={
            onboardingDetailsObj?.stepFour?.socialLinks
          }
          setOnboardingStep={setOnboardingStep}
        />
        <StepFive setOnboardingStep={setOnboardingStep} />
      </StackedCard>
    </div>
  );
};

export default MainContainer;
