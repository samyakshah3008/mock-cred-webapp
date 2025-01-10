"use client";

import Filters from "@/components/dashboard/booking/filters";
import { get } from "@/config/API";
import { bookingEndpoint } from "@/constants/APIEndpoints";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

const MainContainer = () => {
  const [bookingData, setBookingData] = useState<any>(null);
  const [currentEventStatus, setCurrentEventStatus] =
    useState<string>("unconfirmed");
  const [currentRole, setCurrentRole] = useState<string>("interviewer");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showEmptyState, setShowEmptyState] = useState<boolean>(false);

  const { toast } = useToast();

  const fetchBookingDetails = async () => {
    try {
      const response = await get(bookingEndpoint);
      setBookingData(response?.data?.bookings || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error fetching booking details, ${error?.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderBookingData = () => {
    if (!bookingData?._id) {
      setShowEmptyState(true);
    }

    let filteredData;

    if (currentRole == "interviewee") {
      // 5 statuses - upcoming, unconfirmed, past, canceled, approved
      filteredData = bookingData?.intervieweeBookings.filter(
        (item: any) => item?.status === currentEventStatus
      );

      return filteredData;
    } else {
      // 5 statuses - upcoming, unconfirmed, past, canceled, approved

      filteredData = bookingData?.interviewerBookings.filter(
        (item: any) => item?.status === currentEventStatus
      );
      console.log(filteredData, "filtereddata");
      return filteredData;
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  return (
    <div>
      <div>Current event status - {currentEventStatus} </div>
      <div> Current role - {currentRole} </div>
      <Filters
        setCurrentEventStatus={setCurrentEventStatus}
        setCurrentRole={setCurrentRole}
      />

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {showEmptyState ? (
            <div>No booking data available</div>
          ) : (
            <div>
              Booking Data:
              {renderBookingData()?.map((booking: any) => {
                if (!booking?._id) return null; // show empty state
                return (
                  <div key={booking?._id}>
                    <div>{booking?._id}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MainContainer;
