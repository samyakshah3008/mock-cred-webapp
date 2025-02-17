import { Button } from "@/components/ui/button";
import ReusableDialog from "@/components/ui/common/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { deleteEventService } from "@/services/events.service";
import {
  IconArrowElbowRight,
  IconClock,
  IconCopy,
  IconCopyCheck,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";

interface ServiceItemProps {
  openParticularItemSheet: any;
  getList: any;
  currentUser: any;
  selectedEventItem: any;
  setSelectedEventItem: any;
  fetchAllEvents: any;
  userRole: string;
}

const ServiceItem = ({
  openParticularItemSheet,
  getList,
  currentUser,
  selectedEventItem,
  setSelectedEventItem,
  fetchAllEvents,
  userRole,
}: ServiceItemProps) => {
  const [copied, setCopied] = useState(false);
  const [isConfirmDeleteEventDialogOpen, setIsConfirmDeleteEventDialogOpen] =
    useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const openEditItemHandler = (e: any, option: any) => {
    e.stopPropagation();
    openParticularItemSheet(option);
  };

  const handleCopy = async (itemURL: string) => {
    try {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/${currentUser?.onboardingDetails?.stepOne?.username}/${itemURL}`
      );
      setCopied(true);

      toast({
        description: "Link copied to clipboard!",
      });

      setTimeout(() => setCopied(false), 5000);
    } catch (err) {
      toast({
        description: "Failed to copy link.",
        variant: "destructive",
      });
    }
  };

  const navigateToPublicPageHandler = (itemURL: string) => {
    if (window) {
      window.open(
        `/${currentUser?.onboardingDetails?.stepOne?.username}/${itemURL}`,
        "_blank"
      );
    }
  };

  const onConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteEventService(selectedEventItem?._id, userRole);
      toast({
        description: "Event deleted successfully!",
      });
      setSelectedEventItem(null);
      fetchAllEvents();
    } catch (error) {
      toast({
        description: "Failed to delete event.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsConfirmDeleteEventDialogOpen(false);
    }
  };

  const onCloseConfirmDeleteEventDialog = () => {
    setIsConfirmDeleteEventDialogOpen(false);
  };

  return (
    <div className="rounded-md border-subtle border w-[80%] lg:w-[900px] m-auto bg-white mt-5">
      {getList()?.length === 0
        ? null
        : getList()?.map((option: any, index: any) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center justify-between bg-default border-subtle dark:bg-muted dark:hover:bg-emphasis group relative border-b transition first:rounded-t-md last:rounded-b-md last:border-b-0 p-5"
            >
              {/* Left Section - Service Info */}
              <div className="w-full">
                <h2 className="text-default pr-2 text-sm font-semibold">
                  {option?.title}
                </h2>
                <div className="text-default pr-2 text-sm mt-2">
                  For Years of Experience:{" "}
                  {option?.yoe === 0 ? "0-1" : option?.yoe}
                </div>

                <div className="flex gap-2 mt-2 flex-wrap">
                  {option?.technologies?.map(
                    (technology: string, idx: number) => (
                      <div
                        key={idx}
                        className="border-2 border-solid p-1 rounded-lg bg-gray-200 text-xs"
                      >
                        {technology}
                      </div>
                    )
                  )}
                </div>

                <div className="text-subtle mt-2">
                  <div className="font-medium inline-flex items-center justify-center rounded gap-x-1 bg-orange-400 text-white py-1 px-1.5 text-xs leading-3">
                    <IconClock size={16} />
                    {option?.duration}m
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {/* Navigate Button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => navigateToPublicPageHandler(option?.url)}
                        variant="outline"
                        size="icon"
                        className="bg-white border"
                      >
                        <IconArrowElbowRight size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">Preview</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Copy Button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => handleCopy(option?.url)}
                        variant="outline"
                        size="icon"
                        className="bg-white border"
                      >
                        {!copied ? (
                          <IconCopy size={16} />
                        ) : (
                          <IconCopyCheck size={16} />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">
                      Copy URL
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Edit Button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={(e) => openEditItemHandler(e, option)}
                        variant="outline"
                        size="icon"
                        className="bg-white border"
                      >
                        <IconEdit size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">
                      Edit Event
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Delete Button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => {
                          setSelectedEventItem(option);
                          setIsConfirmDeleteEventDialogOpen(true);
                        }}
                        variant="outline"
                        size="icon"
                        className="bg-white border"
                      >
                        <IconTrash size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">
                      Delete Event
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ))}

      <ReusableDialog
        isOpen={isConfirmDeleteEventDialogOpen}
        onClose={onCloseConfirmDeleteEventDialog}
        onConfirm={onConfirmDelete}
        isProcessing={isDeleting}
        title="Confirm Delete?"
        description={`You are about to delete this event. This action is irreversible. Are you sure you want to delete it?`}
        confirmText="Yes, I want to delete!"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};

export default ServiceItem;
