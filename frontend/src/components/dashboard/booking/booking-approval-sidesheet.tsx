"use client";

import { Button } from "@/components/ui/button";
import LucideLoader from "@/components/ui/common/loader";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { approveBookingService } from "@/services/booking.service";
import { useState } from "react";

type BookingApprovalSidesheetProps = {
  show: any;
  setShow: any;
  fetchBookingDetails: any;
  selectedBookingObj: any;
  setSelectedBookingObj: any;
  currentRole: any;
};

const BookingApprovalSidesheet = ({
  show,
  setShow,
  fetchBookingDetails,
  selectedBookingObj,
  setSelectedBookingObj,
  currentRole,
}: BookingApprovalSidesheetProps) => {
  const [approvalObj, setApprovalObj] = useState<any>({
    rating: "",
    testimonialText: "",
    feedbackText: "",
  });
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const onOpenChangeHandler = () => {
    setSelectedBookingObj(null);
    setLoading(false);
    setShow(!show);
  };

  const approveBooking = async () => {
    const interviewDetails = {
      date: selectedBookingObj?.date,
      interviewerName:
        selectedBookingObj?.participantInformation?.interviewer?.name,
      intervieweeName:
        selectedBookingObj?.participantInformation?.interviewee?.name,
      interviewTitle: selectedBookingObj?.bookingTitle,
      interviewTechStacks: selectedBookingObj?.interviewTechStacks,
      interviewBookingLink: selectedBookingObj?.bookingLink,
    };
    try {
      setLoading(true);
      await approveBookingService(
        selectedBookingObj?.meetingId,
        currentRole,
        approvalObj?.testimonialText,
        approvalObj?.rating,
        approvalObj?.feedbackText,
        interviewDetails
      );
      fetchBookingDetails();
      toast({
        title: "Booking approved successfully! 🎉",
        description: `You have successfully approved the booking of ${
          currentRole == "interviewer"
            ? selectedBookingObj?.participantInformation?.interviewee?.name
            : selectedBookingObj?.participantInformation?.interviewer?.name
        }) `,
      });
    } catch (error: any) {
      toast({
        title: "Failed to approve booking!",
        description: `Uh oh, we couldn't approve the booking. Please try again later.`,
      });
    } finally {
      setLoading(false);
      onOpenChangeHandler();
    }
  };

  return (
    <>
      <Sheet open={show} onOpenChange={onOpenChangeHandler}>
        <SheetContent className="p-6 bg-gray-50 rounded-lg shadow-lg overflow-y-auto w-full sm:w-full md:max-w-[500px] flex flex-col gap-4">
          <SheetHeader>
            <SheetTitle className="text-2xl font-semibold text-gray-800">
              Approve booking of{" "}
              {currentRole == "interviewer"
                ? selectedBookingObj?.participantInformation?.interviewee?.name
                : selectedBookingObj?.participantInformation?.interviewer
                    ?.name}{" "}
            </SheetTitle>
            <SheetDescription>
              Please note that you are approving booking of your mate and giving
              testimonials which your mate will be able to showcase to their
              public profile. Be honest with your ratings and testimonials.{" "}
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-black">Rating out of 5 </div>
              <Input
                value={approvalObj?.rating || ""}
                onChange={(e: any) => {
                  if (e.target.value > 5) {
                    setApprovalObj({
                      ...approvalObj,
                      rating: 5,
                    });
                  } else if (e.target.value < 0) {
                    setApprovalObj({
                      ...approvalObj,
                      rating: 0,
                    });
                  } else {
                    setApprovalObj({
                      ...approvalObj,
                      rating: e.target.value,
                    });
                  }
                }}
                placeholder="5"
                type="number"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-black">
                Share your honest Testimonial:
              </div>
              <Textarea
                value={approvalObj?.testimonialText || ""}
                onChange={(e) => {
                  setApprovalObj({
                    ...approvalObj,
                    testimonialText: e.target.value,
                  });
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-black">
                Give private feedback which only your mate can see:{" "}
              </div>

              <Textarea
                value={approvalObj?.feedbackText || ""}
                onChange={(e) => {
                  setApprovalObj({
                    ...approvalObj,
                    feedbackText: e.target.value,
                  });
                }}
              />
            </div>
            <div className="text-sm text-red-500">
              Note that this will not approve your booking, rather you are
              approving your mate's booking which confirms that you are
              officially approving their booking. To get your booking approved
              if haven't yet, consider reaching them out.{" "}
            </div>
          </div>
          <SheetFooter className="flex-1 items-end">
            <Button
              onClick={approveBooking}
              disabled={
                loading ||
                approvalObj?.rating == undefined ||
                !approvalObj?.testimonialText ||
                !approvalObj?.feedbackText
              }
              className="w-full"
            >
              {loading ? <LucideLoader /> : null}
              {loading ? "Approving..." : "Approve Booking"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default BookingApprovalSidesheet;
