"use client";

import Webcam from "react-webcam";

const RecordAnswerSection = ({ webcamEnabled, setWebcamEnabled }: any) => {
  return (
    <Webcam
      className="h-64 w-full md:w-[500px] "
      mirrored={true}
      onUserMedia={() => setWebcamEnabled(true)}
      onUserMediaError={() => setWebcamEnabled(false)}
    />
  );
};

export default RecordAnswerSection;
