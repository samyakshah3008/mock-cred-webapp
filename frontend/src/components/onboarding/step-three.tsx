"use client";

import { defaultAvailability } from "@/app/dashboard/calendar/constants";
import { postWithToken } from "@/config/API";
import { saveUserOnboardingDetails } from "@/constants/APIEndpoints";
import { useToast } from "@/hooks/use-toast";
import { IconArrowLeft, IconArrowRight, IconChecks } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import LucideLoader from "../ui/common/loader";
import OnboardingAvailabilityForm from "./onboarding-availability-form";

const StepThree = ({ setOnboardingStep }: any) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState(defaultAvailability);

  const router = useRouter();

  const saveFormAndNext = async () => {
    setLoading(true);
    try {
      const response = await postWithToken(saveUserOnboardingDetails, {
        stepCount: 3,
        detailsObj: availability,
      });

      router.push("/dashboard");
    } catch (error) {
      toast({ title: "Failed to save details" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[92vw] h-[83vh] md:w-[90vw] lg:w-[840px] lg:h-[560px] bg-white shadow-md rounded-3xl flex flex-col p-12">
      <div className="flex gap-2 flex-col">
        <div className="text-xl font-semibold">
          Nearly there! Set your availability!
        </div>
        <div className="text-sm">
          Define ranges of time when you are available. You can customise all of
          this later in the availability page.
        </div>
      </div>

      <div className="overflow-y-scroll">
        <OnboardingAvailabilityForm
          availability={availability}
          setAvailability={setAvailability}
        />
      </div>

      <div className="flex items-center justify-between mt-8">
        <div className="text-sm font-medium">STEP 2 OF 3</div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setOnboardingStep(1)}
          >
            {" "}
            <IconArrowLeft size="14" /> Previous step
          </Button>
          <Button disabled={loading} size="sm" onClick={saveFormAndNext}>
            {" "}
            {loading ? <LucideLoader className="mr-0" /> : null}
            Next step <IconArrowRight size="14" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8">
        <div className="text-sm font-medium">STEP 3 OF 4</div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setOnboardingStep(1)}
          >
            <IconArrowLeft size="14" /> Previous step
          </Button>
          <Button size="sm" onClick={saveFormAndNext} disabled={loading}>
            {loading ? <LucideLoader className="mr-0" /> : null}
            {loading ? "Saving..." : "Finish!"} <IconChecks size="14" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepThree;
