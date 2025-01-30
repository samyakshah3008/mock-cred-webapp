"use client";

import { postWithToken } from "@/config/API";
import { saveUserOnboardingDetails } from "@/constants/APIEndpoints";
import { useToast } from "@/hooks/use-toast";
import { IconArrowLeft, IconChecks } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import LucideLoader from "../ui/common/loader";
import { Input } from "../ui/input";

const StepFive = ({ setOnboardingStep }: any) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [technicalDetails, setTechnicalDetails] = useState<{
    position: string;
    company: string;
    preferredTechStack: string[];
    technologyInput: string;
    yearsOfExperience: string;
  }>({
    position: "",
    company: "",
    preferredTechStack: [],
    technologyInput: "",
    yearsOfExperience: "",
  });

  const router = useRouter();

  const saveFormAndNext = async () => {
    setLoading(true);
    try {
      const response = await postWithToken(saveUserOnboardingDetails, {
        stepCount: 5,
        detailsObj: technicalDetails,
      });

      router.push("/dashboard");
    } catch (error) {
      toast({ title: "Failed to save details" });
    } finally {
      setLoading(false);
    }
  };

  const changeTechnicalDetailsHandler = (e: any) => {
    setTechnicalDetails({
      ...technicalDetails,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-[92vw] h-[83vh] md:w-[90vw] lg:w-[840px] lg:h-[560px] bg-white shadow-md rounded-3xl flex flex-col p-12">
      <div className="flex gap-2 flex-col">
        <div className="text-xl font-semibold">
          Last Step! Add your technical details!
        </div>
        <div className="text-sm">
          Bonus tip: Adding your technical details up to date will help you find
          the right match for bookings.
        </div>
      </div>

      <div
        className="mt-10 flex flex-col flex-1 gap-4 overflow-y-scroll p-2"
        id="creatorJourneySetup"
      >
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">
            Company/University (Present):{" "}
          </div>
          <Input
            type="url"
            placeholder="Documenso / Stanford University"
            value={technicalDetails.company}
            name="company"
            onChange={changeTechnicalDetailsHandler}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">
            What's your current role/program:{" "}
          </div>
          <Input
            type="url"
            placeholder="Software Engineer / Computer Science"
            value={technicalDetails.position}
            name="position"
            onChange={changeTechnicalDetailsHandler}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-sm text-black">
            Preferred Technologies/Domain:
          </div>
          <div className="flex gap-2">
            <Input
              value={technicalDetails.technologyInput}
              placeholder="e.g., React"
              onChange={(e) => {
                setTechnicalDetails({
                  ...technicalDetails,
                  technologyInput: e.target.value,
                });
              }}
            />
            <Button
              disabled={
                !technicalDetails?.technologyInput ||
                technicalDetails?.preferredTechStack?.length >= 5
              }
              onClick={() => {
                if (
                  technicalDetails.technologyInput &&
                  !technicalDetails.preferredTechStack.includes(
                    technicalDetails.technologyInput.trim()
                  )
                ) {
                  setTechnicalDetails({
                    ...technicalDetails,
                    preferredTechStack: [
                      ...technicalDetails.preferredTechStack,
                      technicalDetails.technologyInput.trim(),
                    ],
                    technologyInput: "",
                  });
                }
              }}
            >
              Add
            </Button>
          </div>

          <div className="flex gap-2 flex-wrap mt-2">
            {technicalDetails?.preferredTechStack?.map(
              (tech: string, index: any) => (
                <div
                  key={index}
                  className="flex items-center px-3 py-1 bg-gray-200 text-sm rounded-full gap-2"
                >
                  <span>{tech}</span>
                  <button
                    className="text-red-500"
                    onClick={() => {
                      const updatedTechnologies =
                        technicalDetails?.preferredTechStack.filter(
                          (item: string) => item !== tech
                        );
                      setTechnicalDetails({
                        ...technicalDetails,
                        preferredTechStack: updatedTechnologies,
                      });
                    }}
                  >
                    ✕
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">
            What's your years of experience:{" "}
          </div>
          <Input
            placeholder="5"
            value={technicalDetails.yearsOfExperience}
            name="yearsOfExperience"
            type="number"
            onChange={changeTechnicalDetailsHandler}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-8">
        <div className="text-sm font-medium">STEP 5 OF 5</div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setOnboardingStep(3)}
          >
            <IconArrowLeft size="14" /> Previous step
          </Button>
          <Button
            size="sm"
            onClick={saveFormAndNext}
            disabled={
              loading ||
              !technicalDetails.company ||
              !technicalDetails.position ||
              technicalDetails.yearsOfExperience == undefined ||
              technicalDetails.yearsOfExperience === "" ||
              !technicalDetails.preferredTechStack.length
            }
          >
            {loading ? <LucideLoader className="mr-0" /> : null}
            {loading ? "Saving..." : "Finish!"} <IconChecks size="14" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepFive;
