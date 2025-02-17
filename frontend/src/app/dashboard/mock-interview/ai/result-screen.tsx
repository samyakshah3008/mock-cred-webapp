"use client";

import { useToast } from "@/hooks/use-toast";
import { addNewEntryToDBService } from "@/services/ai-mock-interview.service";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ResultScreen = ({ userFinalFeedbackObj, mockInterviewObj }: any) => {
  const [isFetching, setIsFetching] = useState(true);

  const { toast } = useToast();

  const router = useRouter();

  const addNewEntryToDB = async () => {
    const payload = {
      jobDescription: mockInterviewObj?.jobDescription,
      jobRole: mockInterviewObj?.jobRole,
      yearsOfExperience: mockInterviewObj?.yearsOfExperience,
      interviewDetails: userFinalFeedbackObj,
    };

    try {
      setIsFetching(true);
      const responseEntrySaved = await addNewEntryToDBService(payload);
      toast({
        title: "Interview saved!",
        description:
          "We have successfully saved this mock interview, you can check it anytime. ",
      });

      router.push(
        `/dashboard/mock-interview/ai/${responseEntrySaved?.data?._id}`
      );
    } catch (error) {
      toast({
        title: "Something went wrong while adding new AI Entry",
        variant: "destructive",
      });
      router.push("/dashboard/mock-interview/ai");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    addNewEntryToDB();
  }, []);

  if (isFetching) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader className="mr-2 h-8 w-8 animate-spin" /> Preparing your
        result...
      </div>
    );
  }

  return <div>Preparing your result...</div>;
};

export default ResultScreen;
