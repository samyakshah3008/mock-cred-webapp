"use client";
import { Button } from "@/components/ui/button";
import LucideLoader from "@/components/ui/common/loader";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { chatSession } from "@/utils/GeminiAI";
import { useState } from "react";

const defaultPaperObj = [
  {
    questions: "Explain what is React",
    answer: "React is JavaScript's library!",
  },
  { questions: "What is nextJS", answer: "It's ReactJS Full Stack Framework!" },
  { questions: "What is tailwindCSS", answer: "It's CSS component library" },
];

type StartNewMockInterviewSidesheetProps = {
  children: React.ReactNode;
  show: any;
  setShow: any;
  setIsMockInterviewStarted: any;
  setAiInterviewPaperObj: any;
  mockInterviewObj: any;
  setMockInterviewObj: any;
};

const StartNewMockInterviewSidesheet = ({
  show,
  setShow,
  setIsMockInterviewStarted,
  setAiInterviewPaperObj,
  mockInterviewObj,
  setMockInterviewObj,
  children,
}: StartNewMockInterviewSidesheetProps) => {
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const onOpenChangeHandler = () => {
    setMockInterviewObj({
      jobRole: "",
      jobDescription: "",
      yearsOfExperience: null,
    });
    setLoading(false);
    setShow(!show);
  };

  const startNewMockInterview = async () => {
    const inputPrompt = `Job Position: ${mockInterviewObj.jobRole}, Job Description: ${mockInterviewObj.jobDescription} Years of experience: ${mockInterviewObj.yearsOfExperience}, depending on the job position, description and years of experience give me 5 Interview question along with Answer in JSON format where please give question and answer as key in each obj. `;

    try {
      setLoading(true);
      const result = await chatSession.sendMessage(inputPrompt);
      const mockJSONRes = JSON.parse(
        result.response
          .text()
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim()
      );
      setAiInterviewPaperObj(mockJSONRes);
      setIsMockInterviewStarted(true);
    } catch (error: any) {
      toast({
        title:
          "Something went wrong while starting interview, please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setShow(false);
    }
  };

  return (
    <>
      <Sheet open={show} onOpenChange={onOpenChangeHandler}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="p-6 bg-gray-50 rounded-lg shadow-lg overflow-y-auto w-full sm:w-full md:max-w-[500px] flex flex-col gap-4">
          <SheetHeader>
            <SheetTitle className="text-2xl font-semibold text-gray-800">
              Start New Mock Interview With AI
            </SheetTitle>
            <SheetDescription>
              Please fill all the necessary details so that we can prepare your
              mock interview with AI
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-black">Job Role: </div>
              <Input
                value={mockInterviewObj.jobRole}
                onChange={(e: any) =>
                  setMockInterviewObj({
                    ...mockInterviewObj,
                    jobRole: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm text-black">
                Please describe the Job Description/Tech Stack in short
              </div>

              <Textarea
                value={mockInterviewObj.jobDescription}
                onChange={(e: any) =>
                  setMockInterviewObj({
                    ...mockInterviewObj,
                    jobDescription: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-black">
                Mention the Years of Experience:{" "}
              </div>
              <Input
                value={mockInterviewObj.yearsOfExperience || ""}
                type="number"
                onChange={(e: any) => {
                  if (e.target.value > 85) {
                    setMockInterviewObj({
                      ...mockInterviewObj,
                      yearsOfExperience: 85,
                    });
                  } else if (e.target.value <= 0) {
                    setMockInterviewObj({
                      ...mockInterviewObj,
                      yearsOfExperience: 1,
                    });
                  } else {
                    setMockInterviewObj({
                      ...mockInterviewObj,
                      yearsOfExperience: e.target.value,
                    });
                  }
                }}
              />
            </div>
          </div>
          <SheetFooter className="flex-1 items-end">
            <Button
              onClick={startNewMockInterview}
              disabled={
                loading ||
                !mockInterviewObj.jobDescription ||
                !mockInterviewObj.jobRole ||
                !mockInterviewObj.yearsOfExperience
              }
              className="w-full"
            >
              {loading ? <LucideLoader /> : null}
              {loading
                ? "Preparing your questions..."
                : "Start Mock Interview!"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default StartNewMockInterviewSidesheet;
