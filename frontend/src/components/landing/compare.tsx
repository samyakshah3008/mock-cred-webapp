import React from "react";

const comparisonData = [
  {
    feature: "Audience's public profile which gives confidence to recruiter",
    mockCred: true,
    topMate: false,
  },
  {
    feature: "Mutual Approval of the call before showing on public profile",
    mockCred: true,
    topMate: false,
  },
  { feature: "Mock Interview with AI", mockCred: true, topMate: false },
  { feature: "Open Source", mockCred: true, topMate: false },
  { feature: "Creator's monetization support", mockCred: false, topMate: true },
  {
    feature: "Services other than mock interviews",
    mockCred: false,
    topMate: true,
  },

  {
    feature: "Creator's public profile which showcases their work",
    mockCred: true,
    topMate: true,
  },

  { feature: "Free services", mockCred: true, topMate: true },

  { feature: "Seamless Booking", mockCred: true, topMate: true },
  { feature: "Testimonials", mockCred: true, topMate: true },
];

const Compare: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-center text-orange-500 font-bold text-xl underline mb-10">
        Quick Comparison between MockCred and Topmate
      </h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center font-semibold">Feature</div>
        <div className="text-center font-semibold">MockCred</div>
        <div className="text-center font-semibold">Topmate</div>
      </div>
      {comparisonData.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-3 gap-4 py-2 border-b text-sm"
        >
          <div className="text-center">{item.feature}</div>
          <div className="text-center flex flex-col gap-1">
            {item.mockCred ? "✅" : "❌"}{" "}
            <span>
              {" "}
              {!item?.mockCred && index == 4 ? "(Coming soon...)" : ""}{" "}
            </span>
          </div>
          <div className="text-center">{item.topMate ? "✅" : "❌"}</div>
        </div>
      ))}
    </div>
  );
};

export default Compare;
