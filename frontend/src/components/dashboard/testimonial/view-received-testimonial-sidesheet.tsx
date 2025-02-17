"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type ViewReceivedTestimonialSidesheetProps = {
  show: boolean;
  setShow: (value: boolean) => void;
  selectedTestimonialObj: any;
  setSelectedTestimonialObj: (value: any) => void;
};

const ViewReceivedTestimonialSidesheet = ({
  show,
  setShow,
  selectedTestimonialObj,
  setSelectedTestimonialObj,
}: ViewReceivedTestimonialSidesheetProps) => {
  const onOpenChangeHandler = () => {
    setSelectedTestimonialObj(null);
    setShow(false);
  };

  return (
    <Sheet open={show} onOpenChange={onOpenChangeHandler}>
      <SheetContent className="p-6 bg-gray-50 rounded-lg shadow-lg overflow-y-auto w-full sm:w-full md:max-w-[500px] flex flex-col gap-4">
        <SheetHeader>
          <SheetTitle className="text-2xl font-semibold text-gray-800">
            View Detailed Testimonial
          </SheetTitle>
          <SheetDescription>
            Here you can view the detailed testimonial shared by{" "}
            <a
              href={selectedTestimonialObj?.testimonialGiverPublicProfile}
              target="_blank"
              className="text-orange-600 underline"
            >
              {selectedTestimonialObj?.testimonialGiverName}
            </a>
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 text-sm">
          <div className="flex flex-col gap-2">
            <div className="text-sm font-semibold text-black">Rating:</div>
            <div>{selectedTestimonialObj?.rating}/5</div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-sm font-semibold text-black">
              Testimonial you received:
            </div>
            <div>{selectedTestimonialObj?.testimonialText}</div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-sm font-semibold text-black">
              Private feedback you received:
            </div>
            <div>{selectedTestimonialObj?.feedbackText || "Not provided"}</div>
          </div>

          {selectedTestimonialObj?.interviewDetails && (
            <div className="flex flex-col gap-2 p-4 border rounded-lg bg-white shadow-sm">
              <div className="text-sm font-semibold text-black">
                Interview Details:
              </div>
              <div className="text-gray-700">
                <span className="font-semibold">Date:</span>{" "}
                {new Date(
                  selectedTestimonialObj?.interviewDetails?.date
                )?.toLocaleDateString()}
              </div>
              <div className="text-gray-700">
                <span className="font-semibold">Interviewer:</span>{" "}
                {selectedTestimonialObj?.interviewDetails?.interviewerName}
              </div>
              <div className="text-gray-700">
                <span className="font-semibold">Interviewee:</span>{" "}
                {selectedTestimonialObj?.interviewDetails?.intervieweeName}
              </div>
              <div className="text-gray-700">
                <span className="font-semibold">Title:</span>{" "}
                {selectedTestimonialObj?.interviewDetails?.interviewTitle}
              </div>

              {selectedTestimonialObj?.interviewDetails?.interviewTechStacks
                ?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedTestimonialObj?.interviewDetails?.interviewTechStacks?.map(
                    (tech: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm font-medium text-orange-600 bg-orange-100 rounded-full"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              )}

              <div className="mt-2">
                <a
                  href={
                    selectedTestimonialObj?.interviewDetails
                      ?.interviewBookingLink
                  }
                  target="_blank"
                  className="text-orange-600 underline"
                >
                  Book new interview of this type
                </a>
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="flex-1 items-end">
          <Button onClick={onOpenChangeHandler} className="w-full">
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ViewReceivedTestimonialSidesheet;
