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
import { updateEventService } from "@/services/events.service";
import { useState } from "react";

type UpdateEventSidesheetProps = {
  show: any;
  setShow: any;
  fetchAllEvents: any;
  selectedEventItem: any;
  setSelectedEventItem: any;
};

const UpdateEventSidesheet = ({
  show,
  setShow,
  fetchAllEvents,
  selectedEventItem,
  setSelectedEventItem,
}: UpdateEventSidesheetProps) => {
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const onOpenChangeHandler = () => {
    setSelectedEventItem(null);
    setLoading(false);
    setShow(!show);
  };

  const updateEvent = async () => {
    try {
      setLoading(true);
      const response = await updateEventService(selectedEventItem);
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
                value={selectedEventItem?.title}
                placeholder="Quick Chat"
                onChange={(e) => {
                  setSelectedEventItem({
                    ...selectedEventItem,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm text-black">URL</div>

              <Input
                value={selectedEventItem?.url}
                onChange={(e) => {
                  setSelectedEventItem({
                    ...selectedEventItem,
                    url: e.target.value,
                  });
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-black">Meeting notes:</div>
              <Textarea
                value={selectedEventItem?.meetingNotes}
                onChange={(e) => {
                  setSelectedEventItem({
                    ...selectedEventItem,
                    meetingNotes: e.target.value,
                  });
                }}
                placeholder="A quick video meeting."
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-black">Duration:</div>
              <Input
                value={selectedEventItem?.duration}
                onChange={(e) => {
                  setSelectedEventItem({
                    ...selectedEventItem,
                    duration: e.target.value,
                  });
                }}
                type="number"
              />
            </div>

            <div className="flex gap-2">
              <div className="text-sm text-black">Make it Private:</div>
              <Switch
                checked={selectedEventItem?.isPrivate}
                onCheckedChange={() => {
                  setSelectedEventItem({
                    ...selectedEventItem,
                    isPrivate: !selectedEventItem?.isPrivate,
                  });
                }}
              />
            </div>
          </div>
          <SheetFooter className="flex-1 items-end">
            <Button
              onClick={updateEvent}
              disabled={
                loading ||
                !selectedEventItem?.title ||
                !selectedEventItem?.url ||
                !selectedEventItem?.duration
              }
              className="w-full"
            >
              {loading ? <LucideLoader /> : null}
              {loading ? "Updating your event..." : "Update Event"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default UpdateEventSidesheet;
