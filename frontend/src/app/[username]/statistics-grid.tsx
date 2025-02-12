"use client";

const StatisticsGrid = ({
  aggregateStatistics,
}: {
  aggregateStatistics: any;
}) => {
  if (!aggregateStatistics) return null;

  const {
    mockInterviewsGiven,
    mockInterviewsTaken,
    mockIntervieweeRatings,
    mockInterviewerRatings,
    mockIntervieweeTestimonials,
    mockInterviewerTestimonials,
  } = aggregateStatistics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 mt-5 text-sm w-[80%] m-auto">
      <div className="bg-white shadow-md rounded-lg flex flex-col justify-center items-center p-6 text-center">
        <div className="text-3xl mb-4">👨‍💻</div>
        <h2 className="text-xl font-semibold mb-2">
          {mockInterviewsGiven === -1 ? "--" : mockInterviewsGiven}{" "}
        </h2>
        <p className="text-gray-600">Mock Interviews Given</p>
      </div>

      <div className="bg-white shadow-md rounded-lg flex flex-col justify-center items-center p-6 text-center">
        <div className="text-3xl mb-4">👨‍💻</div>
        <h2 className="text-xl font-semibold mb-2">
          {mockInterviewsTaken === -1 ? "--" : mockInterviewsTaken}
        </h2>
        <p className="text-gray-600">Mock Interviews Taken</p>
      </div>

      <div className="bg-white shadow-md rounded-lg flex flex-col justify-center items-center p-6 text-center">
        <div className="text-3xl mb-4">⭐</div>
        <h2 className="text-xl font-semibold mb-2">
          {mockIntervieweeRatings === -1 ? "--" : `${mockIntervieweeRatings}/5`}
        </h2>
        <p className="text-gray-600">Mock Interviewee Ratings</p>
      </div>

      <div className="bg-white shadow-md rounded-lg flex flex-col justify-center items-center p-6 text-center">
        <div className="text-3xl mb-4">🧡</div>
        <h2 className="text-xl font-semibold mb-2">
          {mockIntervieweeTestimonials === -1
            ? "--"
            : mockIntervieweeTestimonials}
        </h2>
        <p className="text-gray-600">Mock Interviewee Testimonials</p>
      </div>

      <div className="bg-white shadow-md rounded-lg flex flex-col justify-center items-center p-6 text-center">
        <div className="text-3xl mb-4">⭐</div>
        <h2 className="text-xl font-semibold mb-2">
          {mockInterviewerRatings === -1 ? "--" : `${mockInterviewerRatings}/5`}
        </h2>
        <p className="text-gray-600">Mock Interviewer Ratings</p>
      </div>

      <div className="bg-white shadow-md rounded-lg flex flex-col justify-center items-center p-6 text-center">
        <div className="text-3xl mb-4">🧡</div>
        <h2 className="text-xl font-semibold mb-2">
          {mockInterviewerTestimonials === -1
            ? "--"
            : mockInterviewerTestimonials}
        </h2>
        <p className="text-gray-600">Mock Interviewer Testimonials</p>
      </div>
    </div>
  );
};

export default StatisticsGrid;
