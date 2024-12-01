"use client";

import StartNewMockInterviewSidesheet from "@/components/mock-interview/ai/start-new-mock-interview-sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useState } from "react";
import NotFoundItem from "../../../../../public/empty-state.png";
import Header from "./header";
import MockInterviewPortal from "./mock-interview-portal";

type MockInterviewObj = {
  jobRole: string;
  jobDescription: string;
  yearsOfExperience: number | null;
};

const MainContainer = () => {
  const mockInterviews: any = [
    { id: 1, title: "Interview 1", description: "Description for Interview 1" },
    { id: 2, title: "Interview 2", description: "Description for Interview 2" },
    { id: 3, title: "Interview 3", description: "Description for Interview 3" },
  ];

  const [showSheet, setShowSheet] = useState(false);
  const [isMockInterviewStarted, setIsMockInterviewStarted] = useState(false);
  const [aiInterviewPaperObj, setAiInterviewPaperObj] = useState<any>(null);
  const [mockInterviewObj, setMockInterviewObj] = useState<MockInterviewObj>({
    jobRole: "",
    jobDescription: "",
    yearsOfExperience: null,
  });

  if (!isMockInterviewStarted) {
    return (
      <div className="flex flex-col gap-4 items-center">
        <Header />

        <StartNewMockInterviewSidesheet
          show={showSheet}
          setShow={setShowSheet}
          setIsMockInterviewStarted={setIsMockInterviewStarted}
          setAiInterviewPaperObj={setAiInterviewPaperObj}
          mockInterviewObj={mockInterviewObj}
          setMockInterviewObj={setMockInterviewObj}
        >
          <Button onClick={() => setShowSheet(true)}>
            Give a New Mock Interview with AI
          </Button>
        </StartNewMockInterviewSidesheet>

        <Separator className="my-6 w-[90%] border-gray-300" />

        {/* Second Section: Mock Interviews */}
        <div className="w-[90%]">
          {/* Title */}
          <h2 className="text-xl font-semibold text-center mb-6">
            Past Mock Interviews
          </h2>

          {/* Empty State */}
          {mockInterviews.length === 0 ? (
            <div className="flex flex-col gap-2 justify-center items-center">
              <Image src={NotFoundItem} alt="Not Found" className="w-40 h-40" />
              <h1 className="text-2xl font-bold">No Mock Interviews Yet!</h1>
              <p className="text-gray-600">
                It looks like you haven’t had any mock interviews so far, give
                one a try today!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockInterviews.map((interview: any, index: string) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold">{interview.title}</h3>
                  <p className="text-gray-600">{interview.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <MockInterviewPortal
      aiInterviewPaperObj={aiInterviewPaperObj}
      mockInterviewObj={mockInterviewObj}
    />
  );
};

export default MainContainer;
