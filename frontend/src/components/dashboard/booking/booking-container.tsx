"use client";

import EmptyState from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { get } from "@/config/API";
import { bookingEndpoint } from "@/constants/APIEndpoints";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DataTable } from "./data-table";

const BookingContainer = () => {
  const [bookingData, setBookingData] = useState<any>(null);
  const [currentEventStatus, setCurrentEventStatus] =
    useState<string>("upcoming");
  const [currentRole, setCurrentRole] = useState<string>("interviewer");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { toast } = useToast();

  const currentUser = useSelector((state: any) => state?.user?.mockCredUser);

  const fetchBookingDetails = async () => {
    try {
      const response = await get(bookingEndpoint);
      setBookingData(response?.data?.bookings || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error fetching booking details, please try again later!`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterBookings = () => {
    if (!bookingData) return [];
    return currentRole === "interviewee"
      ? bookingData?.intervieweeBookings?.filter(
          (item: any) => item.status === currentEventStatus
        )
      : bookingData?.interviewerBookings?.filter(
          (item: any) => item.status === currentEventStatus
        );
  };

  const getEmptyStateAccordingToEventStatus = () => {
    if (currentEventStatus === "approved") {
      return (
        <EmptyState
          title={`No approved bookings`}
          description={`You have no approved bookings. Please consider emailing/requesting the ${
            currentRole === "interviewer" ? "interviewee" : "interviewer"
          } to approve your booking. You can find unapproved booking in the "Past" tab.`}
        />
      );
    } else if (currentEventStatus === "canceled") {
      return (
        <EmptyState
          title={`No ${currentEventStatus} bookings`}
          description={`You have no ${currentEventStatus} bookings. If someone cancels the booking, it will show up here.`}
        />
      );
    } else if (currentEventStatus === "past") {
      return (
        <EmptyState
          title={`No ${currentEventStatus} bookings`}
          description={`You have no ${currentEventStatus} bookings. As soon as any of your booking gets completed, it will show up here.`}
        />
      );
    } else if (currentEventStatus === "unconfirmed") {
      return (
        <EmptyState
          title={`No ${currentEventStatus} bookings`}
          description={`You have no ${currentEventStatus} bookings. If someone unconfirms the booking, it will show up here.`}
        />
      );
    } else {
      return (
        <EmptyState
          title={`No ${currentEventStatus} bookings`}
          description={`You have no ${currentEventStatus} bookings. As soon as someone books a time with you it will show up here.`}
        />
      );
    }
  };

  useEffect(() => {
    if (!currentUser?._id) return;
    if (
      currentUser?.role === "allrounder" ||
      currentUser?.role === "interviewer"
    ) {
      setCurrentRole("interviewer");
    } else {
      setCurrentRole("interviewee");
    }

    fetchBookingDetails();
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader className="mr-2 h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4 pb-3 flex-wrap">
        <div className="flex gap-1 xl:gap-2 flex-wrap">
          {["upcoming", "unconfirmed", "past", "canceled", "approved"].map(
            (status) => (
              <Button
                key={status}
                variant={currentEventStatus === status ? "secondary" : "ghost"}
                onClick={() => setCurrentEventStatus(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            )
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm">Bookings of you as an -</div>
          <Select value={currentRole} onValueChange={setCurrentRole}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="interviewee">Interviewee</SelectItem>
              <SelectItem value="interviewer">Interviewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : filterBookings()?.length === 0 ? (
        <div className="border-dotted border-2 p-4 rounded">
          {getEmptyStateAccordingToEventStatus()}
        </div>
      ) : (
        <DataTable
          data={filterBookings()}
          currentRole={currentRole}
          currentEventStatus={currentEventStatus}
          fetchBookingDetails={fetchBookingDetails}
        />
      )}
    </div>
  );
};

export default BookingContainer;
