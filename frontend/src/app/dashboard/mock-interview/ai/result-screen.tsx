"use client";

const ResultScreen = ({ userFinalFeedbackObj }: any) => {
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
