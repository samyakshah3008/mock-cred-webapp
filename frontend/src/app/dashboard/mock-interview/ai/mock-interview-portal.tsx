"use client";

import { useState } from "react";
import InterviewQuestionsScreen from "./interview-questions-screen";
import ResultScreen from "./result-screen";
import StartingPageHeader from "./starting-page-header";
import WelcomeScreen from "./welcome-screen";

const MockInterviewPortal = ({
  aiInterviewPaperObj,
  mockInterviewObj,
  setIsMockInterviewStarted,
}: any) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [showResultScreen, setShowResultScreen] = useState(false);
  const [userFinalFeedbackObj, setUserFinalFeedbackObj] = useState({
    first: null,
    second: null,
    third: null,
    fourth: null,
    fifth: null,
  });

  const totalQuestions = aiInterviewPaperObj?.length;

  const handleNext = () => {
    if (currentStep < totalQuestions) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  if (showResultScreen) {
    return (
      <ResultScreen
        userFinalFeedbackObj={userFinalFeedbackObj}
        mockInterviewObj={mockInterviewObj}
        setIsMockInterviewStarted={setIsMockInterviewStarted}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center p-5">
      {currentStep === 0 ? <StartingPageHeader /> : null}

      <div className="">
        {currentStep > 0 ? (
          <InterviewQuestionsScreen
            currentStep={currentStep}
            aiInterviewPaperObj={aiInterviewPaperObj}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
            totalQuestions={totalQuestions}
            setShowResultScreen={setShowResultScreen}
            userFinalFeedbackObj={userFinalFeedbackObj}
            setUserFinalFeedbackObj={setUserFinalFeedbackObj}
            mockInterviewObj={mockInterviewObj}
            setIsMockInterviewStarted={setIsMockInterviewStarted}
          />
        ) : (
          <WelcomeScreen
            mockInterviewObj={mockInterviewObj}
            webcamEnabled={webcamEnabled}
            setWebcamEnabled={setWebcamEnabled}
            setCurrentStep={setCurrentStep}
            setIsMockInterviewStarted={setIsMockInterviewStarted}
          />
        )}
      </div>
    </div>
  );
};

export default MockInterviewPortal;
