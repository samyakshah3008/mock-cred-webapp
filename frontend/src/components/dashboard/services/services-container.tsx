"use client";

import CreateEventSidesheet from "@/app/dashboard/services/create-event-sidesheet";
import UpdateEventSidesheet from "@/app/dashboard/services/update-event-sidesheet";
import EmptyState from "@/components/common/empty-state";
import { useState } from "react";
import Filters from "./filters";
import ServiceItem from "./service-item";

interface ServicesContainerProps {
  currentUser: any;
  changeActiveRole: any;
  userRole: any;
  eventsList: any;
  fetchAllEvents: any;
}

const ServicesContainer = ({
  currentUser,
  changeActiveRole,
  userRole,
  eventsList,
  fetchAllEvents,
}: ServicesContainerProps) => {
  const [isCreateEventSidesheetOpen, setIsCreateEventSidesheetOpen] =
    useState(false);
  const [isUpdateEventSidesheetOpen, setIsUpdateEventSidesheetOpen] =
    useState(false);
  const [selectedEventItem, setSelectedEventItem] = useState(null);

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

  return (
    <div className="flex flex-col gap-4">
      <Filters
        currentUser={currentUser}
        userRole={userRole}
        changeActiveRole={changeActiveRole}
        setIsCreateEventSidesheetOpen={setIsCreateEventSidesheetOpen}
      />

      {getList()?.length !== 0 ? (
        <ServiceItem
          getList={getList}
          openParticularItemSheet={openParticularItemSheet}
          currentUser={currentUser}
          selectedEventItem={selectedEventItem}
          setSelectedEventItem={setSelectedEventItem}
          fetchAllEvents={fetchAllEvents}
          userRole={userRole}
        />
      ) : (
        <EmptyState
          title="No events found!"
          description="Create your first event today to get started! 🚀"
        />
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

export default ServicesContainer;
