"use client";

import SingleMockInterviewDetails from "@/components/dashboard/mock-interview-ai/single-mock-interview-details";
import { getMockInterviewDetailsService } from "@/services/ai-mock-interview.service";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const MainContainer = ({ mockInterviewId }: any) => {
  const [isFetching, setIsFetching] = useState(true);
  const [mockInterviewDetails, setMockInterviewDetails] = useState(null);

  const getMockInterviewDetails = async () => {
    try {
      const response = await getMockInterviewDetailsService(mockInterviewId);
      setMockInterviewDetails(response?.data?.data);
    } catch (error) {
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    getMockInterviewDetails();
  }, []);

  if (isFetching) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader className="mr-2 h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <SingleMockInterviewDetails interview={mockInterviewDetails} />;
};

export default MainContainer;
