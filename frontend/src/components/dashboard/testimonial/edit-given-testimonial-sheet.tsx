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
import { useToast } from "@/hooks/use-toast";
import {
  deleteTestimonialService,
  updateTestimonialService,
} from "@/services/testimonials.service";
import { useState } from "react";

type UpdateTestimonialSidesheetProps = {
  show: any;
  setShow: any;
  fetchAllTestimonials: any;
  selectedTestimonial: any;
  setSelectedTestimonial: any;
};

const UpdateGivenTestimonialSidesheet = ({
  show,
  setShow,
  fetchAllTestimonials,
  selectedTestimonial,
  setSelectedTestimonial,
}: UpdateTestimonialSidesheetProps) => {
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const onOpenChangeHandler = () => {
    setSelectedTestimonial(null);
    setLoading(false);
    setShow(!show);
  };

  const updateTestimonial = async () => {
    try {
      setLoading(true);
      await updateTestimonialService(selectedTestimonial);
      toast({ title: "Event updated successfully!" });
      fetchAllTestimonials();
    } catch (error) {
      toast({ title: "Failed to update this event!", variant: "destructive" });
    } finally {
      setLoading(false);
      onOpenChangeHandler();
    }
  };

  const deleteTestimonial = async () => {
    try {
      setLoading(true);
      await deleteTestimonialService(
        selectedTestimonial?.testimonialId,
        selectedTestimonial?.testimonialReceiverUserId
      );
      toast({ title: "Testimonial deleted successfully!" });
      fetchAllTestimonials();
    } catch (error) {
      toast({
        title: "Failed to delete this testimonial!",
        variant: "destructive",
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
              Update Your Given Testimonial
            </SheetTitle>
            <SheetDescription>
              Want to update your given testimonial? You can do it here.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-black">Rating: </div>
              <Input
                value={selectedTestimonial?.rating || ""}
                onChange={(e) => {
                  setSelectedTestimonial({
                    ...selectedTestimonial,
                    rating: e.target.value,
                  });
                }}
                placeholder="5"
                type="number"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-black">Testimonial:</div>
              <Input
                value={selectedTestimonial?.testimonialText || ""}
                onChange={(e) => {
                  setSelectedTestimonial({
                    ...selectedTestimonial,
                    testimonialText: e.target.value,
                  });
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-black">Feedback</div>

              <Input
                value={selectedTestimonial?.feedbackText || ""}
                onChange={(e) => {
                  setSelectedTestimonial({
                    ...selectedTestimonial,
                    feedbackText: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <SheetFooter className="flex-1 items-end">
            <Button variant="destructive" onClick={deleteTestimonial}>
              Delete this
            </Button>
            <Button
              onClick={updateTestimonial}
              disabled={
                loading ||
                !selectedTestimonial?.rating ||
                !selectedTestimonial?.testimonialText ||
                !selectedTestimonial?.feedbackText
              }
              className="w-full"
            >
              {loading ? <LucideLoader /> : null}
              {loading ? "Updating your testimonial..." : "Update Testimonial"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default UpdateGivenTestimonialSidesheet;
