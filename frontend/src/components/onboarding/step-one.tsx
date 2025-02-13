"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { postWithToken } from "@/config/API";
import { saveUserOnboardingDetails } from "@/constants/APIEndpoints";
import { useToast } from "@/hooks/use-toast";
import { IconArrowRight } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "../ui/button";
import LucideLoader from "../ui/common/loader";
import { Input } from "../ui/input";

const StepOne = ({
  setOnboardingStep,
  onboardingDetailsObj,
  setOnboardingDetailsObj,
}: any) => {
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const socialAccountLinkInputHandler = (e: any) => {
    setOnboardingDetailsObj({
      ...onboardingDetailsObj,
      stepOne: {
        ...onboardingDetailsObj?.stepOne,
        socialAccountLink: e.target.value,
      },
    });
  };

  const usernameInputHandler = (e: any) => {
    setOnboardingDetailsObj({
      ...onboardingDetailsObj,
      stepOne: { ...onboardingDetailsObj?.stepOne, username: e.target.value },
    });
  };

  const getRole = () => {
    if (
      onboardingDetailsObj?.stepOne?.howDoUserPlanToUseApp ===
      "Take mock interviews"
    ) {
      return "interviewee";
    } else if (
      onboardingDetailsObj?.stepOne?.howDoUserPlanToUseApp ===
      "Give mock interviews"
    ) {
      return "interviewer";
    } else {
      return "allrounder";
    }
  };

  const saveAndNextHandler = async () => {
    setLoading(true);
    try {
      const response = await postWithToken(saveUserOnboardingDetails, {
        stepCount: 1,
        detailsObj: { ...onboardingDetailsObj?.stepOne, role: getRole() },
      });
      if (response?.statusCode == 200) {
        setOnboardingStep(1);
      }
    } catch (error: any) {
      toast({
        title: error?.data?.errorData || "Failed to save details!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[92vw] h-[83vh] md:w-[90vw] lg:w-[840px] lg:h-[560px] bg-white shadow-md rounded-3xl flex flex-col p-12">
      <div className="flex gap-2 flex-col">
        <div className="text-xl font-semibold">Welcome to MockCred!</div>
        <div className="text-sm">
          We just need some basic info to get your profile setup. You’ll be able
          to edit this later.
        </div>
      </div>
      <div
        className="mt-10 flex flex-col flex-1 gap-4"
        id="creatorJourneySetup"
      >
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">Social Account</div>
          <Input
            type="url"
            placeholder="yourprofile.com"
            value={onboardingDetailsObj?.stepOne?.socialAccountLink}
            onChange={socialAccountLinkInputHandler}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">Username</div>
          <Input
            placeholder=""
            value={onboardingDetailsObj?.stepOne?.username || ""}
            onChange={usernameInputHandler}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">
            How do you plan to use mockcred?
          </div>

          <RadioGroup
            value={onboardingDetailsObj?.stepOne?.howDoUserPlanToUseApp || ""}
            onValueChange={(value) =>
              setOnboardingDetailsObj((prevState: any) => ({
                ...prevState,
                stepOne: {
                  ...prevState.stepOne,
                  howDoUserPlanToUseApp: value,
                },
              }))
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Take mock interviews" id="r1" />
              <Label className="font-normal" htmlFor="r1">
                Take mock interviews
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Give mock interviews" id="r2" />
              <Label className="font-normal" htmlFor="r2">
                Give mock interviews
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="Both give and take mock interviews"
                id="r3"
              />
              <Label className="font-normal" htmlFor="r3">
                Both give and take mock interviews
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8">
        <div className="text-sm font-medium">STEP 1 OF 5</div>
        <div>
          <Button
            disabled={
              !onboardingDetailsObj?.stepOne?.socialAccountLink ||
              !onboardingDetailsObj?.stepOne?.howDoUserPlanToUseApp ||
              !onboardingDetailsObj?.stepOne?.username ||
              loading
            }
            size="sm"
            onClick={saveAndNextHandler}
          >
            {" "}
            {loading ? <LucideLoader className="mr-0" /> : null}
            Next step <IconArrowRight size="14" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepOne;
