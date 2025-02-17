"use client";

import StartNewMockInterviewSidesheet from "@/components/mock-interview/ai/start-new-mock-interview-sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { fetchAIMockInterviewDetailsService } from "@/services/ai-mock-interview.service";
import { Loader } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NotFoundItem from "../../../../../public/empty-state.png";
import Header from "./header";
import MockInterviewPortal from "./mock-interview-portal";

type MockInterviewObj = {
  jobRole: string;
  jobDescription: string;
  yearsOfExperience: number | null;
};

const MainContainer = () => {
  const [showSheet, setShowSheet] = useState(false);
  const [isMockInterviewStarted, setIsMockInterviewStarted] = useState(false);
  const [aiInterviewPaperObj, setAiInterviewPaperObj] = useState<any>(null);
  const [mockInterviewObj, setMockInterviewObj] = useState<MockInterviewObj>({
    jobRole: "",
    jobDescription: "",
    yearsOfExperience: null,
  });
  const [aiMockInterviewsData, setAIMockInterviewsData] = useState<any>([]);
  const [isFetching, setIsFetching] = useState(true);

  const router = useRouter();

  const fetchAIMockInterviewDetails = async () => {
    try {
      const response = await fetchAIMockInterviewDetailsService();
      setAIMockInterviewsData(response?.data?.data || []);
    } catch (error) {
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchAIMockInterviewDetails();
  }, []);

  if (isFetching) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader className="mr-2 h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isMockInterviewStarted) {
    return (
      <div className="flex flex-col gap-4 items-center p-4">
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
          {aiMockInterviewsData?.length === 0 ? (
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
              {aiMockInterviewsData?.aiMockInterviewList?.map(
                (interview: any, index: string) => (
                  <div
                    key={index}
                    className="p-6 rounded-lg border-2 border-solid flex flex-wrap gap-2 justify-between items-center cursor-pointer"
                    onClick={() => {
                      router.push(
                        `/dashboard/mock-interview/ai/${interview?._id}`
                      );
                    }}
                  >
                    <div>
                      <h3 className="font-semibold">{interview?.jobRole}</h3>
                      <p className="text-gray-600 text-sm w-56">
                        {interview?.jobDescription}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {moment(interview?.date).format("DD MMMM YYYY")}
                    </div>
                  </div>
                )
              )}
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
      setIsMockInterviewStarted={setIsMockInterviewStarted}
    />
  );
};

export default MainContainer;
