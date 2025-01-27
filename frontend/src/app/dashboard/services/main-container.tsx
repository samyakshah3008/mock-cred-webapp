"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { fetchAllEventsService } from "@/services/events.service";
import { IconClock } from "@tabler/icons-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CreateEventSidesheet from "./create-event-sidesheet";
import UpdateEventSidesheet from "./update-event-sidesheet";

const MainContainer = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [eventsList, setEventsList] = useState<any>([]);
  const [isCreateEventSidesheetOpen, setIsCreateEventSidesheetOpen] =
    useState(false);
  const [isUpdateEventSidesheetOpen, setIsUpdateEventSidesheetOpen] =
    useState(false);
  const [selectedEventItem, setSelectedEventItem] = useState(null);
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

  const openParticularItemSheet = (eventItem: any) => {
    setSelectedEventItem({ ...eventItem, technologyInput: "" });
    setIsUpdateEventSidesheetOpen(true);
  };

  const getList = () => {
    if (currentUser?.role == "allrounder") {
      if (userRole == "interviewer") {
        return eventsList?.interviewer;
      } else {
        return eventsList?.interviewee;
      }
    } else {
      return eventsList;
    }
  };

  const changeActiveRole = () => {
    if (userRole == "interviewee") {
      setUserRole("interviewer");
    } else {
      setUserRole("interviewee");
    }
  };

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

  if (isFetching || !currentUser?._id) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader className="mr-2 h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {currentUser?.role == "allrounder" ? (
        <div className="flex gap-2 items-center justify-center">
          <div
            onClick={changeActiveRole}
            className={`${userRole == "interviewee" ? "underline" : ""}`}
          >
            Interviewee
          </div>
          <div
            onClick={changeActiveRole}
            className={`${userRole == "interviewer" ? "underline" : ""}`}
          >
            Interviewer
          </div>
        </div>
      ) : null}

      <Button onClick={() => setIsCreateEventSidesheetOpen(true)}>
        Add a new event
      </Button>
      {getList().length != 0 ? (
        <div
          className="rounded-md border-subtle border w-[700px] m-auto bg-white mt-5"
          data-testid="event-types"
        >
          {getList().map((option: any, index: any) => (
            <div
              key={index}
              style={{ display: "flex" }}
              className="bg-default border-subtle dark:bg-muted dark:hover:bg-emphasis hover:bg-muted group relative border-b transition first:rounded-t-md last:rounded-b-md last:border-b-0"
              onClick={() => openParticularItemSheet(option)}
            >
              <div className="block w-full p-5">
                <div className="flex flex-wrap items-center">
                  <h2 className="text-default pr-2 text-sm font-semibold">
                    {option?.title}
                  </h2>
                </div>
                <div className="text-subtle">
                  <ul className="mt-2 flex flex-wrap gap-x-2 gap-y-1">
                    <li>
                      <div className="font-medium inline-flex items-center justify-center rounded gap-x-1 bg-emphasis text-emphasis py-1 px-1.5 text-xs leading-3 bg-orange-400 text-white">
                        <IconClock size={16} />
                        {option?.duration}m
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No services found</div>
      )}

      <CreateEventSidesheet
        show={isCreateEventSidesheetOpen}
        setShow={setIsCreateEventSidesheetOpen}
        fetchAllEvents={fetchAllEvents}
        userRole={userRole}
      />

      <UpdateEventSidesheet
        show={isUpdateEventSidesheetOpen}
        setShow={setIsUpdateEventSidesheetOpen}
        fetchAllEvents={fetchAllEvents}
        selectedEventItem={selectedEventItem}
        setSelectedEventItem={setSelectedEventItem}
        userRole={userRole}
      />
    </div>
  );
};

export default MainContainer;
