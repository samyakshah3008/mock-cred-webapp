"use client";

import { useToast } from "@/hooks/use-toast";
import { getMockInterviewDetailsService } from "@/services/ai-mock-interview.service";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const MainContainer = ({ mockInterviewId }: any) => {
  const [isFetching, setIsFetching] = useState(true);
  const [mockInterviewDetails, setMockInterviewDetails] = useState(null);

  const { toast } = useToast();

  const getMockInterviewDetails = async () => {
    try {
      const response = await getMockInterviewDetailsService(mockInterviewId);
      setMockInterviewDetails(response?.data?.data);
      console.log(response, "res");
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

  return <div> {mockInterviewId} </div>;
};

export default MainContainer;
