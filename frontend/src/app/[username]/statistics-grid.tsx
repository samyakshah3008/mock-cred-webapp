"use client";

import { useToast } from "@/hooks/use-toast";
import { getAggregateStatisticsByUsername } from "@/services/user.service";
import { useEffect, useState } from "react";

const StatisticsGrid = ({ username }: { username: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [aggregateStatistics, setAggregateStatistics] = useState<any>({
    mockInterviewsGiven: 0,
    mockInterviewsTaken: 0,
    mockIntervieweeRatings: 0,
    mockInterviewerRatings: 0,
    mockIntervieweeTestimonials: 0,
    mockInterviewerTestimonials: 0,
  });

  const { toast } = useToast();

  const fetchAggregateStatistics = async () => {
    try {
      const response = await getAggregateStatisticsByUsername(username);
      setAggregateStatistics(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch aggregate statistics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const {
    mockInterviewsGiven,
    mockInterviewsTaken,
    mockIntervieweeRatings,
    mockInterviewerRatings,
    mockIntervieweeTestimonials,
    mockInterviewerTestimonials,
  } = aggregateStatistics;

  useEffect(() => {
    fetchAggregateStatistics();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
