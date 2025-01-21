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
  userRole: string;
};

const CreateEventSidesheet = ({
  show,
  setShow,
  fetchAllEvents,
  userRole,
}: CreateEventSidesheetProps) => {
  const [eventFormDetails, setEventFormDetails] = useState<any>({
    title: "",
    url: "",
    meetingNotes: "",
    duration: "",
    isPrivate: false,
    yoe: "",
    technologies: [],
    technologyInput: "",
    locationURL: "",
  });
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const onOpenChangeHandler = () => {
    setEventFormDetails({
      title: "",
      url: "",
      meetingNotes: "",
      duration: "",
      isPrivate: false,
      yoe: "",
      technologies: [],
      technologyInput: "",
      locationURL: "",
    });
    setLoading(false);
    setShow(!show);
  };

  const createNewEvent = async () => {
    try {
      setLoading(true);
      await createNewEventService({
        ...eventFormDetails,
        role: userRole,
      });
      fetchAllEvents();
    } catch (error) {
      toast({ title: "Failed to create a new event.", variant: "destructive" });
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
                placeholder="Frontend Developer"
                onChange={(e) => {
                  setEventFormDetails({
                    ...eventFormDetails,
                    title: e.target.value,
                  });
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-black">Years of experience:</div>
              <Input
                value={eventFormDetails.yoe}
                onChange={(e) => {
                  setEventFormDetails({
                    ...eventFormDetails,
                    yoe: e.target.value,
                  });
                }}
                placeholder="5"
                type="number"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-black">Public URL</div>

              <Input
                value={eventFormDetails.url}
                onChange={(e) => {
                  setEventFormDetails({
                    ...eventFormDetails,
                    url: e.target.value,
                  });
                }}
                placeholder="30min-quick-chat"
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
                placeholder="30"
                type="number"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-black">Location:</div>
              <Input
                value={eventFormDetails.locationURL}
                onChange={(e) => {
                  setEventFormDetails({
                    ...eventFormDetails,
                    locationURL: e.target.value,
                  });
                }}
                placeholder="https://meet.google.com/xyz"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-black">Technologies:</div>
              <div className="flex gap-2">
                <Input
                  value={eventFormDetails.technologyInput}
                  placeholder="e.g., React"
                  onChange={(e) => {
                    setEventFormDetails({
                      ...eventFormDetails,
                      technologyInput: e.target.value,
                    });
                  }}
                />
                <Button
                  disabled={!eventFormDetails.technologyInput}
                  onClick={() => {
                    if (
                      eventFormDetails.technologyInput &&
                      !eventFormDetails.technologies.includes(
                        eventFormDetails.technologyInput.trim()
                      )
                    ) {
                      setEventFormDetails({
                        ...eventFormDetails,
                        technologies: [
                          ...eventFormDetails.technologies,
                          eventFormDetails.technologyInput.trim(),
                        ],
                        technologyInput: "",
                      });
                    }
                  }}
                >
                  Add
                </Button>
              </div>

              <div className="flex gap-2 flex-wrap mt-2">
                {eventFormDetails?.technologies?.map(
                  (tech: string, index: any) => (
                    <div
                      key={index}
                      className="flex items-center px-3 py-1 bg-gray-200 text-sm rounded-full gap-2"
                    >
                      <span>{tech}</span>
                      <button
                        className="text-red-500"
                        onClick={() => {
                          const updatedTechnologies =
                            eventFormDetails?.technologies.filter(
                              (item: string) => item !== tech
                            );
                          setEventFormDetails({
                            ...eventFormDetails,
                            technologies: updatedTechnologies,
                          });
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  )
                )}
              </div>
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
                !eventFormDetails.duration ||
                !eventFormDetails.locationURL ||
                !eventFormDetails.technologies.length
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
