"use client";

import { useToast } from "@/hooks/use-toast";
import {
  fetchAllOrganizerEventsService,
  fetchAllTestimonialsService,
} from "@/services/events.service";
import { getAggregateStatisticsByUsername } from "@/services/user.service";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import BookingInterviewContainer from "./booking-interview-container";
import { getUserByUsername } from "./helper";
import ProfileSection from "./profile-section";
import StatisticsGrid from "./statistics-grid";
import Testimonials from "./testimonials";

const MainContainer = ({ tab, username }: any) => {
  const [isEventsLoading, setIsEventsLoading] = useState(true);
  const [isAggregateScoreLoading, setIsAggregateScoreLoading] = useState(true);
  const [isTestimonialsLoading, setIsTestimonialsLoading] = useState(true);
  const [isUserLoading, setIsUserLoading] = useState(true);

  const [user, setUser] = useState<any>(null);

  const [aggregateStatistics, setAggregateStatistics] = useState<any>({
    mockInterviewsGiven: 0,
    mockInterviewsTaken: 0,
    mockIntervieweeRatings: 0,
    mockInterviewerRatings: 0,
    mockIntervieweeTestimonials: 0,
    mockInterviewerTestimonials: 0,
  });

  const [eventsList, setEventsList] = useState<any>([]);
  const [testimonials, setTestimonials] = useState<any>([]);

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
      setIsAggregateScoreLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await getUserByUsername(username);
      setUser(response);
    } catch {
      toast({
        title: "Failed to fetch user, please try again later. ",
        variant: "destructive",
      });
    } finally {
      setIsUserLoading(false);
    }
  };

  const fetchAllEvents = async () => {
    try {
      const response = await fetchAllOrganizerEventsService(user?._id);
      setEventsList(response?.data);
    } catch (error) {
      toast({
        title: "Failed to fetch events, please try again later. ",
        variant: "destructive",
      });
    } finally {
      setIsEventsLoading(false);
    }
  };

  const fetchAllTestimonials = async () => {
    try {
      const response = await fetchAllTestimonialsService(user?._id);
      setTestimonials(response?.testimonials);
    } catch (error) {
      toast({
        title: "Failed to fetch testimonials, please try again later. ",
        variant: "destructive",
      });
    } finally {
      setIsTestimonialsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchAggregateStatistics();
  }, []);

  useEffect(() => {
    if (!user?._id) return;
    fetchAllEvents();
    fetchAllTestimonials();
  }, [user]);

  if (
    isEventsLoading ||
    isAggregateScoreLoading ||
    isUserLoading ||
    isTestimonialsLoading
  ) {
    return (
      <div className="h-96 w-96 flex items-center justify-center m-auto">
        <Loader className="mr-2 h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#f3f4f6] min-h-screen p-4 pt-10">
      <div className="flex flex-col gap-4">
        <ProfileSection user={user} />
        <div className="flex flex-col md:flex-row gap-2 justify-center">
          {[
            {
              label: `View ${user?.firstName || "User"}'s Statistics`,
              value: "statistics",
            },
            { label: "Book an interview", value: "schedule" },
            {
              label: `What people speak about ${user?.firstName || "User"}`,
              value: "testimonials",
            },
          ].map((navItem, index) => {
            return (
              <Link
                key={index}
                href={`/${username}?tab=${navItem.value}`}
                className={`border-2 text-sm ${
                  tab == navItem.value ? "border-orange-400" : ""
                } rounded-md p-2 cursor-pointer`}
              >
                {navItem.label}
              </Link>
            );
          })}
        </div>
        {tab === "statistics" && (
          <StatisticsGrid aggregateStatistics={aggregateStatistics} />
        )}
        {tab === "schedule" && (
          <BookingInterviewContainer
            username={username}
            user={user}
            isLoading={isEventsLoading}
            eventsList={eventsList}
          />
        )}
        {tab === "testimonials" && (
          <Testimonials
            user={user}
            testimonials={testimonials}
            isLoading={isTestimonialsLoading}
          />
        )}
      </div>
    </div>
  );
};

export default MainContainer;
