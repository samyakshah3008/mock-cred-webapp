"use client";

import { postWithToken } from "@/config/API";
import { saveUserOnboardingDetailsStepTwo } from "@/constants/APIEndpoints";
import { useToast } from "@/hooks/use-toast";
import { IconArrowLeft, IconArrowRight, IconUpload } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import LucideLoader from "../ui/common/loader";
import { Textarea } from "../ui/textarea";

const StepTwo = ({
  setOnboardingStep,
  onboardingDetailsObj,
  setOnboardingDetailsObj,
  setAvatarPreview,
  avatarPreview,
}: any) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file)); // Generate a preview URL
      setOnboardingDetailsObj({
        ...onboardingDetailsObj,
        stepTwo: { ...onboardingDetailsObj?.stepTwo, profilePicURL: file },
      });
    }
  };

  const saveAndNextHandler = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append(
        "profilePic",
        onboardingDetailsObj?.stepTwo?.profilePicURL
      );
      formData.append("aboutText", onboardingDetailsObj?.stepTwo?.aboutText);

      const response = await postWithToken(
        saveUserOnboardingDetailsStepTwo,
        formData
      );
      if (response?.statusCode == 200) {
        setOnboardingStep(2);
      }
    } catch (error: any) {
      toast({ title: "Failed to save details!", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[92vw] h-[83vh] md:w-[90vw] lg:w-[840px] lg:h-[560px] bg-white shadow-md rounded-3xl flex flex-col p-12">
      <div className="flex gap-2 flex-col">
        <div className="text-xl font-semibold">Be visible!</div>
        <div className="text-sm">
          A brief description about you and a photo really helps you get mock
          interviews booked and let people know who they're booking with.
        </div>
      </div>
      <div
        className="mt-10 flex flex-col flex-1 gap-4"
        id="creatorJourneySetup"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="text-sm font-medium">Upload your picture!</div>
          <div
            className="rounded-full w-32 h-32 border-gray-300 border-2 flex items-center justify-center transition-transform duration-200 hover:bg-gray-200 hover:scale-105 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            style={{
              backgroundImage: avatarPreview
                ? `url(${
                    avatarPreview ||
                    onboardingDetailsObj?.stepTwo?.profilePicURL
                  })`
                : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {!avatarPreview && <IconUpload size={30} />}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            name="profilePic"
            onChange={handleAvatarChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">
            A few sentences about yourself. This will appear on your personal
            url page.
          </div>
          <Textarea
            placeholder="Start typing your bio here..."
            className="placeholder:text-sm"
            value={onboardingDetailsObj?.stepTwo?.aboutText}
            onChange={(e) =>
              setOnboardingDetailsObj({
                ...onboardingDetailsObj,
                stepTwo: {
                  ...onboardingDetailsObj?.stepTwo,
                  aboutText: e.target.value,
                },
              })
            }
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-8">
        <div className="text-sm font-medium">STEP 2 OF 5</div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setOnboardingStep(0)}
          >
            {" "}
            <IconArrowLeft size="14" /> Previous step
          </Button>
          <Button
            disabled={
              loading ||
              !onboardingDetailsObj?.stepTwo?.aboutText?.length ||
              !onboardingDetailsObj?.stepTwo?.profilePicURL
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

export default StepTwo;
