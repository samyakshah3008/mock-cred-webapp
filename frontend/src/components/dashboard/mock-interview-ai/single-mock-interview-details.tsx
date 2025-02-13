"use client";

import { Button } from "@/components/ui/button";
import { IconStarFilled } from "@tabler/icons-react";
import moment from "moment";
import { useRouter } from "next/navigation";

const SingleMockInterviewDetails = ({ interview }: any) => {
  const router = useRouter();

  const goBackToAIMockInterviewPortalHandler = () => {
    router.push("/dashboard/mock-interview/ai");
  };

  if (!interview) return null;

  return (
    <div className="p-6">
      <Button
        onClick={goBackToAIMockInterviewPortalHandler}
        variant="link"
        className="text-center underline w-full"
      >
        Go back to Mock Interview with AI Portal
      </Button>
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-semibold">{interview?.jobRole}</h2>
        <p className="text-gray-600">
          {interview?.yearsOfExperience} years experience
        </p>
        <p className="mt-2 text-gray-700">{interview?.jobDescription}</p>
        <p className="mt-2 text-gray-500 text-sm">
          {moment(interview?.date).format("DD MMMM YYYY, h:mm A")}
        </p>
      </div>

      <div>
        {Object.keys(interview?.interviewDetails).map((key, index) => {
          const item = interview?.interviewDetails[key];
          return (
            <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold">{item?.question}</h3>
              <p className="mt-2 text-gray-700">
                <span className="font-medium">Your Answer:</span>{" "}
                {item?.userAnswer}
              </p>
              <p className="mt-2 text-green-600">
                <span className="font-medium">Correct Answer:</span>{" "}
                {item?.correctAnswer}
              </p>
              <p className="mt-2 text-red-500">
                <span className="font-medium">Feedback:</span> {item?.feedback}
              </p>
              <div className="mt-3 flex items-center">
                <span className="font-medium text-gray-700">Rating:</span>
                <div className="flex ml-2">
                  {[...Array(5)].map((_, i) => (
                    <IconStarFilled
                      key={i}
                      className={
                        i < item?.rating ? "text-yellow-500" : "text-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SingleMockInterviewDetails;
