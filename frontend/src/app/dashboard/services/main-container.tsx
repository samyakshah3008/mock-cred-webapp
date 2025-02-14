"use client";

import Header from "@/components/dashboard/services/header";
import ServicesContainer from "@/components/dashboard/services/services-container";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { fetchAllEventsService } from "@/services/events.service";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const MainContainer = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [eventsList, setEventsList] = useState<any>([]);

  const [userRole, setUserRole] = useState<any>(null);

  const { toast } = useToast();
  const currentUser = useSelector((state: any) => state?.user?.mockCredUser);

  const fetchAllEvents = async () => {
    try {
      const response = await fetchAllEventsService();
      setEventsList(response?.data?.data?.myServiceItems || []);
    } catch (error) {
      toast({ title: "Failed to fetch event details", variant: "destructive" });
    } finally {
      setIsFetching(false);
    }
  };

  const changeActiveRole = () => {
    if (userRole == "interviewee") {
      setUserRole("interviewer");
    } else {
      setUserRole("interviewee");
    }
  };

  const sections = [
    <Header />,
    <ServicesContainer
      currentUser={currentUser}
      userRole={userRole}
      changeActiveRole={changeActiveRole}
      eventsList={eventsList}
      fetchAllEvents={fetchAllEvents}
    />,
  ];

  useEffect(() => {
    if (!currentUser?._id) return;
    if (
      currentUser?.role == "allrounder" ||
      currentUser?.role == "interviewer"
    ) {
      setUserRole("interviewer");
    } else {
      setUserRole("interviewee");
    }
    fetchAllEvents();
  }, [currentUser]);

  if (isFetching) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader className="mr-2 h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 p-4">
      {sections.map((section, id) => {
        return (
          <>
            {section}
            {id < sections.length - 1 ? <Separator /> : null}
          </>
        );
      })}
    </div>
  );
};

export default MainContainer;
