"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, WebcamIcon } from "lucide-react";
import Webcam from "react-webcam";

const WelcomeScreen = ({
  mockInterviewObj,
  webcamEnabled,
  setWebcamEnabled,
  setCurrentStep,
}: any) => {
  return (
    <div className="mt-5 flex gap-20 items-start">
      {/* Left Section */}
      <div className="flex flex-col gap-6 flex-1">
        {/* Job Description Card */}
        <div className="text-sm border-l-4 border-green-500 bg-green-50 shadow-md rounded-lg p-6 text-center">
          <div>
            <span className="font-semibold">Job Role:</span>{" "}
            {mockInterviewObj?.jobRole}
          </div>
          <div>
            <span className="font-semibold">Job Description:</span>{" "}
            {mockInterviewObj?.jobDescription}
          </div>
          <div>
            <span className="font-semibold">Years of Experience:</span>{" "}
            {mockInterviewObj?.yearsOfExperience}
          </div>
        </div>

        {/* Information Card */}
        <div className="text-sm border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-yellow-500 w-6 h-6" />
          <div>
            <h3 className="font-semibold">Important Information</h3>
            <p className="text-gray-600">
              Please ensure your microphone and camera are functional before
              starting the interview.
            </p>
            <div className="text-gray-600">
              <p>
                1. Ensure you are in a quiet and distraction-free environment.
              </p>
              <p>2. Speak clearly and confidently during your responses.</p>
              <p>
                3. Use examples from your past experience to support your
                answers.
              </p>
              <p>
                4. Take your time to understand the question before answering.
              </p>
              <p>
                5. Remember to maintain eye contact and display positive body
                language.
              </p>
            </div>
          </div>
        </div>

        {/* Interview Instructions */}
      </div>

      {/* Right Section */}
      <div className="flex-1">
        {webcamEnabled ? (
          <div className="w-full flex flex-col gap-2">
            <Webcam
              onUserMedia={() => setWebcamEnabled(true)}
              onUserMediaError={() => setWebcamEnabled(false)}
              mirrored={true}
              className="w-[500px] h-[300px]"
            />
            <Button className="w-full" onClick={() => setWebcamEnabled(true)}>
              Enable Web Cam and Microphone
            </Button>
          </div>
        ) : (
          <div>
            <WebcamIcon className="w-full h-[200px] my-7 p-20 bg-secondary" />
            <Button className="w-full" onClick={() => setWebcamEnabled(true)}>
              Enable Web Cam and Microphone
            </Button>
          </div>
        )}
        <Button
          onClick={() => setCurrentStep(1)}
          className="mt-2 bg-orange-500 hover:bg-orange-400 w-full"
        >
          Start Interview!
        </Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
