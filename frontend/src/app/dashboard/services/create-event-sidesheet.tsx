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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createNewEventService } from "@/services/events.service";
import { useState } from "react";

type CreateEventSidesheetProps = {
  show: any;
  setShow: any;
  fetchAllEvents: any;
};

const CreateEventSidesheet = ({
  show,
  setShow,
  fetchAllEvents,
}: CreateEventSidesheetProps) => {
  const [eventFormDetails, setEventFormDetails] = useState<any>({
    title: "",
    url: "",
    meetingNotes: "",
    duration: 30,
    isPrivate: false,
  });
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const onOpenChangeHandler = () => {
    setEventFormDetails({
      title: "",
      url: "",
      meetingNotes: "",
      duration: 30,
      isPrivate: false,
    });
    setLoading(false);
    setShow(!show);
  };

  const createNewEvent = async () => {
    try {
      setLoading(true);
      const response = await createNewEventService(eventFormDetails);
      fetchAllEvents();
    } catch (error) {
      toast({ title: "Failed to create a new event." });
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
              Add a new event type
            </SheetTitle>
            <SheetDescription>
              Create a new event type for people to book times with.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-black">Title: </div>
              <Input
                value={eventFormDetails.title}
                placeholder="Quick Chat"
                onChange={(e) => {
                  setEventFormDetails({
                    ...eventFormDetails,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm text-black">URL</div>

              <Input
                value={eventFormDetails.url}
                onChange={(e) => {
                  setEventFormDetails({
                    ...eventFormDetails,
                    url: e.target.value,
                  });
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-black">Meeting notes:</div>
              <Textarea
                value={eventFormDetails.meetingNotes}
                onChange={(e) => {
                  setEventFormDetails({
                    ...eventFormDetails,
                    meetingNotes: e.target.value,
                  });
                }}
                placeholder="A quick video meeting."
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-black">Duration:</div>
              <Input
                value={eventFormDetails.duration}
                onChange={(e) => {
                  setEventFormDetails({
                    ...eventFormDetails,
                    duration: e.target.value,
                  });
                }}
                type="number"
              />
            </div>

            <div className="flex gap-2">
              <div className="text-sm text-black">Make it Private:</div>
              <Switch
                checked={eventFormDetails?.isPrivate}
                onCheckedChange={(checked) => {
                  setEventFormDetails({
                    ...eventFormDetails,
                    isPrivate: !eventFormDetails?.isPrivate,
                  });
                }}
              />
            </div>
          </div>
          <SheetFooter className="flex-1 items-end">
            <Button
              onClick={createNewEvent}
              disabled={
                loading ||
                !eventFormDetails.title ||
                !eventFormDetails.url ||
                !eventFormDetails.duration
              }
              className="w-full"
            >
              {loading ? <LucideLoader /> : null}
              {loading ? "Creating your event..." : "Create Event"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CreateEventSidesheet;
