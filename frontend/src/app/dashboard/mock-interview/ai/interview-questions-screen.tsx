"use client";

import { Button } from "@/components/ui/button";
import LucideLoader from "@/components/ui/common/loader";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { chatSession } from "@/utils/GeminiAI";
import { IconDoorExit } from "@tabler/icons-react";
import { Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import RecordAnswerSection from "./record-answer-section";

const InterviewQuestionsScreen = ({
  currentStep,
  aiInterviewPaperObj,
  handlePrevious,
  totalQuestions,
  setShowResultScreen,
  handleNext,
  userFinalFeedbackObj,
  setUserFinalFeedbackObj,
  setIsMockInterviewStarted,
}: any) => {
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [isRecordingStarted, setIsRecordingStarted] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [isRecordingOnce, setIsRecordingOnce] = useState(true);
  const [isShowAnswer, setIsShowAnswer] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSpeechBrowserError, setIsSpeechBrowserError] = useState(false);

  const { toast } = useToast();

  const textToSpeech = (text: string) => {
    if (!window) return;
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh, your browser doesn't support text to speech",
      });
    }
  };

  const {
    error,
    setResults,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const saveAnswerAndStopRecording = () => {
    if (userAnswer?.length < 10) {
      toast({ title: "Answer is too short", variant: "destructive" });
    }
    toast({
      title: "Answer saved successfully! ✅",
      description:
        "We have saved your answer! You may re-record or proceed further. ",
    });

    setResults([]);
    stopSpeechToText();
  };

  const resetValues = () => {
    setIsRecordingOnce(true);
    setUserAnswer("");
    setIsRecordingStarted(false);
    setIsShowAnswer(false);
  };

  const saveAndNextHandler = async (
    questionNumber: string | any,
    showResult = false
  ) => {
    setIsSaving(true);

    const feedbackPrompt = `Question: ${
      aiInterviewPaperObj[currentStep - 1]?.question
    }, user answer: ${userAnswer}, depending on this question and answer please give the rating for answer, and the feedback in maximum 5 sentences for feedback, it should be in JSON format with keys - rating and feedback.`;

    try {
      const result = await chatSession.sendMessage(feedbackPrompt);
      const mockJSONRes = JSON.parse(
        result.response.text().replace("```json", "").replace("```", "")
      );

      setUserFinalFeedbackObj({
        ...userFinalFeedbackObj,
        [questionNumber]: {
          question: aiInterviewPaperObj[currentStep - 1]?.question,
          correctAnswer: aiInterviewPaperObj[currentStep - 1]?.answer,
          userAnswer: userAnswer,
          feedback: mockJSONRes?.feedback,
          rating: mockJSONRes?.rating,
        },
      });

      resetValues();
      if (!showResult) {
        handleNext();
      } else {
        setShowResultScreen(true);
      }
    } catch (error) {
      toast({
        title: "Failed to save the answer, please try again. ",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetInterview = () => {
    setIsMockInterviewStarted(false);
  };

  useEffect(() => {
    results.map((result: any) =>
      setUserAnswer((prevAns) => prevAns + result?.transcript)
    );
  }, [results]);

  useEffect(() => {
    if (error?.length) {
      setIsSpeechBrowserError(true);
    } else {
      setIsSpeechBrowserError(false);
    }
  }, [error]);

  return (
    <div className="flex flex-col gap-5 items-center">
      <div
        className="text-red-500 font-bold flex gap-2 cursor-pointer hover:underline"
        onClick={resetInterview}
      >
        {" "}
        <IconDoorExit /> Exit Interview
      </div>
      <div className="flex flex-col lg:flex-row gap-6 p-6">
        {/* Left Section */}
        <div className="flex flex-col gap-4 flex-1">
          <h2 className="text-lg font-semibold">Question #{currentStep}</h2>
          <p className="text-gray-600">
            {aiInterviewPaperObj[currentStep - 1]?.question}
          </p>
          <Volume2
            className="cursor-pointer"
            onClick={() =>
              textToSpeech(aiInterviewPaperObj[currentStep - 1]?.question)
            }
          />
          <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-lg">
            <p className="text-orange-700 text-sm">
              Note: Click on record when you want to answer the question. At the
              end of interview, we will give you feedback of your answers. Once
              you submit answer, you cannot edit back. So make sure you
              re-record or edit your answer before moving to next question. Good
              luck!
            </p>
          </div>

          {!isRecordingOnce || isSpeechBrowserError ? (
            <div>
              {isShowAnswer || isSpeechBrowserError ? (
                <Button
                  onClick={() => setIsShowAnswer(false)}
                  className="text-orange-500"
                  size="sm"
                  variant="link"
                >
                  {isSpeechBrowserError
                    ? "Please write down your answer and go next once you complete."
                    : "Hide Answer"}
                </Button>
              ) : (
                <Button
                  onClick={() => setIsShowAnswer(true)}
                  size="sm"
                  variant="link"
                  className="text-orange-500"
                >
                  Show my answer
                </Button>
              )}

              {isShowAnswer || isSpeechBrowserError ? (
                <Textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="text-sm"
                />
              ) : null}
            </div>
          ) : null}

          {currentStep > 0 && (
            <div className="flex gap-4">
              {currentStep === totalQuestions ? (
                <Button
                  onClick={() => {
                    let questionNumber;
                    if (currentStep == 1) {
                      questionNumber = "first";
                    } else if (currentStep == 2) {
                      questionNumber = "second";
                    } else if (currentStep == 3) {
                      questionNumber = "third";
                    } else if (currentStep == 4) {
                      questionNumber = "fourth";
                    } else if (currentStep == 5) {
                      questionNumber = "fifth";
                    }
                    saveAndNextHandler(questionNumber, true);
                  }}
                >
                  Finish
                </Button>
              ) : (
                <Button
                  disabled={isSaving || !userAnswer?.length}
                  onClick={() => {
                    let questionNumber;
                    if (currentStep == 1) {
                      questionNumber = "first";
                    } else if (currentStep == 2) {
                      questionNumber = "second";
                    } else if (currentStep == 3) {
                      questionNumber = "third";
                    } else if (currentStep == 4) {
                      questionNumber = "fourth";
                    } else if (currentStep == 5) {
                      questionNumber = "fifth";
                    }

                    saveAndNextHandler(questionNumber);
                  }}
                >
                  {isSaving ? <LucideLoader className="mr-0" /> : null}
                  {isSaving ? "Saving your answer..." : "Save and Next"}{" "}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex flex-col gap-4 flex-1 items-center justify-center">
          <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center">
            {!webcamEnabled ? (
              <p className="text-gray-500 text-center">[Webcam]</p>
            ) : null}
            {webcamEnabled ? (
              <RecordAnswerSection
                webcamEnabled={webcamEnabled}
                setWebcamEnabled={setWebcamEnabled}
              />
            ) : null}
          </div>
          <div className="text-sm">
            Webcam:{" "}
            <Switch
              checked={webcamEnabled}
              onCheckedChange={() => setWebcamEnabled(!webcamEnabled)}
            />{" "}
          </div>
          {isRecording ? (
            <Button
              disabled={error?.length ? true : false}
              onClick={() => {
                if (isRecordingOnce) {
                  setIsRecordingOnce(false);
                }
                saveAnswerAndStopRecording();
              }}
              size="sm"
              variant="destructive"
            >
              Stop Recording
            </Button>
          ) : (
            <Button
              disabled={error?.length ? true : false}
              onClick={() => {
                setUserAnswer("");
                startSpeechToText();
              }}
              size="sm"
            >
              {isRecordingOnce ? "Start Recording" : "Re-record Answer"}
            </Button>
          )}
          {error && (
            <div className="text-red-500 font-bold text-sm"> {error} </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewQuestionsScreen;
