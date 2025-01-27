"use client";

import Filters from "@/components/dashboard/booking/filters";
import { Button } from "@/components/ui/button";
import { get } from "@/config/API";
import { bookingEndpoint } from "@/constants/APIEndpoints";
import { useToast } from "@/hooks/use-toast";
import {
  approveBookingService,
  bookingChangeStatusService,
} from "@/services/booking.service";
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
      filteredData = bookingData?.intervieweeBookings?.filter(
        (item: any) => item?.status === currentEventStatus
      );

      return filteredData || [];
    } else {
      // 5 statuses - upcoming, unconfirmed, past, canceled, approved

      filteredData = bookingData?.interviewerBookings?.filter(
        (item: any) => item?.status === currentEventStatus
      );
      console.log(filteredData, "filtereddata");
      return filteredData || [];
    }
  };

  const changeStatus = async (
    status: string,
    meetingId: string,
    bookingLink: string
  ) => {
    try {
      await bookingChangeStatusService(
        status,
        currentRole,
        meetingId,
        "I got other commitments, apologize for the inconvenience",
        bookingLink
      );

      fetchBookingDetails();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error changing status, ${error?.message}`,
      });
    } finally {
    }
  };

  const approveBooking = async (meetingId: string, booking: any) => {
    const interviewDetails = {
      date: booking?.date,
      interviewerName: booking?.participantInformation?.interviewer?.name,
      intervieweeName: booking?.participantInformation?.interviewee?.name,
      interviewTitle: booking?.bookingTitle,
      interviewTechStacks: booking?.interviewTechStacks,
      interviewBookingLink: booking?.bookingLink,
    };
    try {
      await approveBookingService(
        meetingId,
        currentRole,
        "Great meeting",
        5,
        "Great meeting",
        interviewDetails
      );
      fetchBookingDetails();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error changing status, ${error?.message}`,
      });
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
                console.log(booking, " booking");
                if (!booking?._id) return null; // show empty state
                return (
                  <div key={booking?._id}>
                    <div>{booking?._id}</div>
                    <div className="flex gap-4 flex-wrap">
                      <Button
                        onClick={() =>
                          changeStatus(
                            "unconfirmed",
                            booking?.meetingId,
                            booking?.bookingLink
                          )
                        }
                      >
                        Change status to unconfirmed
                      </Button>
                      <Button
                        onClick={() =>
                          changeStatus(
                            "canceled",
                            booking?.meetingId,
                            booking?.bookingLink
                          )
                        }
                      >
                        Change status to cancel
                      </Button>
                      <Button
                        onClick={() =>
                          approveBooking(booking?.meetingId, booking)
                        }
                      >
                        Change status to approved
                      </Button>
                      <Button
                        onClick={() =>
                          changeStatus(
                            "upcoming",
                            booking?.meetingId,
                            booking?.bookingLink
                          )
                        }
                      >
                        Change status to upcoming
                      </Button>
                      <Button
                        onClick={() =>
                          changeStatus(
                            "rescheduled",
                            booking?.meetingId,
                            booking?.bookingLink
                          )
                        }
                      >
                        Cancel this booking and request for reschedule
                      </Button>
                      {!booking?.hasApproved &&
                      (booking?.status === "past" ||
                        booking?.status === "approved") ? (
                        <Button>Give feedback to opposite</Button>
                      ) : null}
                    </div>
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
