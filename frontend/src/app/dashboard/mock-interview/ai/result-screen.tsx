"use client";

import { useToast } from "@/hooks/use-toast";
import { addNewEntryToDBService } from "@/services/ai-mock-interview.service";
import { useEffect } from "react";

const ResultScreen = ({ userFinalFeedbackObj, mockInterviewObj }: any) => {
  const { toast } = useToast();

  const addNewEntryToDB = async () => {
    const payload = {
      jobDescription: mockInterviewObj?.jobDescription,
      jobRole: mockInterviewObj?.jobRole,
      yearsOfExperience: mockInterviewObj?.yearsOfExperience,
      interviewDetails: userFinalFeedbackObj,
    };

    try {
      await addNewEntryToDBService(payload);
      toast({
        title: "Interview saved!",
        description:
          "We have successfully saved this mock interview, you can check it anytime. ",
      });
    } catch (error) {
      toast({
        title: "Something went wrong while adding new AI Entry",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    addNewEntryToDB();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {Object.values(userFinalFeedbackObj).map((item: any, index) => {
        return (
          <div>
            #{index + 1}
            <div>{item?.rating}</div>
            <div>{item?.question}</div>
            <div> {item?.correctAnswer} </div>
            <div> {item?.userAnswer} </div>
            <div> {item?.feedback} </div>
          </div>
        );
      })}
    </div>
  );
};

export default ResultScreen;
