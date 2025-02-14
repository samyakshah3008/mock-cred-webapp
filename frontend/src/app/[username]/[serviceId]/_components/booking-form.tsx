import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { bookNewInterviewService } from "@/services/booking.service";
import { findBookedSlotsService } from "@/services/user.service";
import { format } from "date-fns";
import { Loader } from "lucide-react";
import moment from "moment";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { calculateEndTime } from "../helper";

interface BookingFormProps {
  event: {
    firstName: string;
    lastName: string;
    email: string;
    service: {
      title: string;
      meetingNotes: string;
      duration: number;
      url: string;
      isPrivate: boolean;
      bookingCount: number;
      locationURL: string;
      yoe: number;
      technologies: string[];
      _id: string;
    };
    userAvaibility: {
      _id: string;
      userId: string;
      timeGap: number;
      monday: { isAvailable: boolean; startTime?: string; endTime?: string };
      tuesday: { isAvailable: boolean; startTime?: string; endTime?: string };
      wednesday: { isAvailable: boolean; startTime?: string; endTime?: string };
      thursday: { isAvailable: boolean; startTime?: string; endTime?: string };
      friday: { isAvailable: boolean; startTime?: string; endTime?: string };
      saturday: { isAvailable: boolean };
      sunday: { isAvailable: boolean };
    };
  };
}

export default function BookingForm({
  user,
  event,
  availability,
  setShowSuccessScreen,
  loading,
  setLoading,
}: BookingFormProps | any) {
  const [selectedSlot, setSelectedSlot] = useState<string | null | any>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isFetchingBookedSlots, setIsFetchingBookedSlots] = useState(true);

  const currentUser = useSelector((state: any) => state?.user?.mockCredUser);

  const [selectedDate, setSelectedDate] = useState<Date | any>(null);
  const [bookedSlots, setBookedSlots] = useState<any>([]);

  const params = useParams();
  const username: any = params.username;

  const router = useRouter();
  const { toast } = useToast();
  const pathname = usePathname();

  const {
    service: { duration, locationURL, title, technologies },
  } = event;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    // resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: any) => {
    const bookingData = {
      name: currentUser?.firstName + " " + currentUser?.lastName,
      email: currentUser?.email,
      startTime: selectedSlot,
      endTime: calculateEndTime(selectedDate, selectedSlot, duration),
      date: data.date,
      additionalInfo: data.additionalInfo,
      organizerUsername: username,
      locationURL,
      duration,
      status: "upcoming",
      role: currentUser?.role,
      bookingLink: pathname,
      bookingTitle: title,
      interviewTechStacks: technologies || [],
    };

    try {
      setLoading(true);
      const response = await bookNewInterviewService(bookingData);
      setShowSuccessScreen(true);
    } catch (error) {
      console.error("Error booking event:", error);
      toast({
        title: "Uh oh, failed to book event. Please try again later. ",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const findBookedSlots = async () => {
    if (!selectedDate) return;
    const normalizedFrontendDate = moment(selectedDate).format("YYYY-MM-DD");

    try {
      setIsFetchingBookedSlots(true);
      const response = await findBookedSlotsService(
        username,
        event?.roleOfFoundServiceItem,
        normalizedFrontendDate
      );
      setBookedSlots(response?.data?.bookedSlots || []);
    } catch (error) {
      console.error("Error finding booked slots:", error);
    } finally {
      setIsFetchingBookedSlots(false);
    }
  };

  const availableDays = availability.map((day: any) => new Date(day.date));

  const timeSlots = selectedDate
    ? availability.find(
        (day: any) => day.date === format(selectedDate, "yyyy-MM-dd")
      )?.slots || []
    : [];

  const handleSlotSelection = (slot: string) => setSelectedSlot(slot);

  const checkShouldBeDisableHandler = () => {
    if (
      user?.onboardingDetails?.stepOne?.username ===
      currentUser?.onboardingDetails?.stepOne?.username
    ) {
      return true;
    } else if (currentUser?.role === event?.roleOfFoundServiceItem) {
      return true;
    }
    return false;
  };

  const getTextAccordingToRole = () => {
    if (event?.roleOfFoundServiceItem === "interviewee") {
      return "interviewee";
    } else {
      return "interviewer";
    }
  };

  useEffect(() => {
    if (!currentUser?._id) return;
    setIsFetching(false);
  }, [currentUser]);

  useEffect(() => {
    if (selectedDate) {
      setValue("date", format(selectedDate, "yyyy-MM-dd"));
      findBookedSlots();
    }
  }, [selectedDate, setValue]);

  useEffect(() => {
    if (selectedSlot) {
      setValue("time", selectedSlot);
    }
  }, [selectedSlot, setValue]);

  if (isFetching) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader className="mr-2 h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-[90%] xl:w-[1040px] h-full lg:h-[490px] flex flex-col lg:flex-row border bg-white rounded-md">
      {!selectedSlot ? (
        <>
          <div className="flex flex-col flex-wrap w-full lg:w-1/3 p-4 border-r pt-5 gap-5 overflow-y-auto">
            <div className="flex flex-col items-center">
              <img
                src={user?.onboardingDetails?.stepTwo?.profilePicURL}
                alt="Avatar"
                className="rounded-full w-24 h-24 object-contain border-2 border-solid"
              />
              <h2 className="text-lg font-semibold">
                {event.firstName} {event.lastName}
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm">
                <span className="font-medium">Title:</span>{" "}
                {event.service.title}
              </p>
              <div className="text-sm">
                <span className="font-medium">Years of Experience: </span>
                {event.service.yoe == 0 ? "Fresher" : event?.service?.yoe}
              </div>{" "}
              <div className="text-sm font-medium">
                Tech Stacks for this interview -
              </div>
              {event?.service?.technologies?.length > 0 && (
                <div className="flex flex-wrap gap-2 text-sm">
                  {event?.service?.technologies.map(
                    (tech: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              )}
              <p className="text-sm">
                <div className="flex gap-2 items-center">
                  <span className="font-medium">Location:</span>
                  <a
                    className="underline text-orange-500"
                    href={event.service.locationURL}
                    target="_blank"
                  >
                    Join here
                  </a>
                </div>
              </p>
              <p className="text-sm">
                <span className="font-medium">Duration: </span>
                {event.service.duration}m
              </p>
              <div className="text-sm">
                {" "}
                <span className="font-medium">Please note: </span>
                {event.firstName} {event.lastName} will appear as -{" "}
                <span className="text-orange-500">
                  {getTextAccordingToRole()}{" "}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 border-r flex-1">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
              }}
              disabled={(day) => {
                const today = moment().startOf("day");
                const selectedDay = moment(day).startOf("day");

                const availableDaysSet = new Set(
                  availableDays.map((d: any) => moment(d).format("YYYY-MM-DD"))
                );

                return (
                  selectedDay.isBefore(today) ||
                  !availableDaysSet.has(selectedDay.format("YYYY-MM-DD"))
                );
              }}
              modifiers={{ available: availableDays }}
              className="rounded-md border"
            />
          </div>

          <div className="w-full lg:w-1/3 p-4 overflow-y-auto">
            {timeSlots?.length ? (
              timeSlots?.map((slot: any, index: any) => (
                <Button
                  variant="outline"
                  key={index}
                  className="w-full mb-2 text-sm text-center cursor-pointer"
                  onClick={() => handleSlotSelection(slot)}
                  disabled={bookedSlots.includes(slot) || isFetchingBookedSlots}
                >
                  {slot}
                </Button>
              ))
            ) : (
              <div className="text-sm h-full flex items-center justify-center">
                No available slots.{" "}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col w-full lg:w-1/2 p-4 border-r pt-5 gap-5 overflow-y-auto">
            <div className="flex items-center  justify-center gap-5">
              <div className="flex flex-col items-center">
                <img
                  src={user?.onboardingDetails?.stepTwo?.profilePicURL}
                  alt="Avatar"
                  className="rounded-full w-24 h-24 object-contain border-2 border-solid"
                />
              </div>

              <div className="flex flex-col items-center">
                {user?.onboardingDetails?.stepOne?.username !==
                currentUser?.onboardingDetails?.stepOne?.username ? (
                  <img
                    src={currentUser?.onboardingDetails?.stepTwo?.profilePicURL}
                    alt="Avatar"
                    className="rounded-full w-24 h-24 object-contain border-2 border-solid"
                  />
                ) : null}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm">
                <span className="font-medium">Title:</span>{" "}
                {event.service.title}
              </p>
              <div className="text-sm">
                <span className="font-medium">Years of Experience: </span>
                {event.service.yoe == 0 ? "Fresher" : event?.service?.yoe}
              </div>{" "}
              <div className="text-sm font-medium">
                Tech Stacks for this interview -
              </div>
              {event?.service?.technologies?.length > 0 && (
                <div className="flex flex-wrap gap-2 text-sm">
                  {event?.service?.technologies.map(
                    (tech: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              )}
              <p className="text-sm">
                <div className="flex gap-2 items-center">
                  <span className="font-medium">Location:</span>
                  <a
                    className="underline text-orange-500"
                    href={event.service.locationURL}
                    target="_blank"
                  >
                    Join here
                  </a>
                </div>
              </p>
              <p className="text-sm">
                <span className="font-medium">Duration: </span>
                {event.service.duration}m
              </p>
              <div className="text-sm">
                {" "}
                <span className="font-medium">Interviewer Name: </span>
                {event?.roleOfFoundServiceItem === "interviewer" &&
                user?.onboardingDetails?.stepOne?.username !==
                  currentUser?.onboardingDetails?.stepOne?.username
                  ? `${event.firstName} ${" "} ${event.lastName}`
                  : `${currentUser?.firstName}${" "}${
                      currentUser?.lastName
                    } (You)`}
              </div>
              <div className="text-sm">
                {" "}
                <span className="font-medium">Interviewee Name: </span>
                {event?.roleOfFoundServiceItem === "interviewee" &&
                user?.onboardingDetails?.stepOne?.username !==
                  currentUser?.onboardingDetails?.stepOne?.username
                  ? `${event.firstName} ${" "} ${event.lastName}`
                  : `${currentUser?.firstName}${" "}${
                      currentUser?.lastName
                    } (You)`}
              </div>
              <p className="text-sm">
                <span className="font-medium">Selected slot: </span>
                {selectedSlot}
              </p>
              <div className="text-sm">
                <span className="font-medium">Date: </span>
                {format(selectedDate, "dd-MM-yyyy")}
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 p-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Label>Full Name:</Label>
              <Input
                type="text"
                value={currentUser?.firstName + " " + currentUser?.lastName}
                placeholder="Name"
                className="p-2 border w-full mb-2 mt-2"
                disabled={true}
                {...register("name")}
              />
              <Label>Email Address:</Label>
              <Input
                type="email"
                value={currentUser?.email}
                placeholder="Email"
                className="p-2 border w-full mb-2 mt-2"
                disabled={true}
                {...register("email")}
              />
              <Label>Additional Information:</Label>
              <Textarea
                placeholder="Additional Info"
                className="p-2 border w-full mb-2 mt-2"
                {...register("additionalInfo")}
                disabled={loading}
              />
              <Button
                className="w-full p-2 bg-orange-400 text-white hover:bg-orange-500"
                disabled={checkShouldBeDisableHandler() || loading}
                type="submit"
              >
                {loading
                  ? "Booking, please wait..."
                  : `Confirm Booking with ${user?.firstName}`}
              </Button>

              {checkShouldBeDisableHandler() ? (
                <div className="flex flex-col gap-2">
                  {" "}
                  <div className="text-red-500 text-center text-sm mt-4 border-red-500 border p-2 rounded-md font-semibold">
                    {user?.onboardingDetails?.stepOne?.username ===
                    currentUser?.onboardingDetails?.stepOne?.username
                      ? "You cannot book interview with yourself"
                      : `Uh oh!, you cannot proceed because you both have same roles- ${event?.roleOfFoundServiceItem}, consider changing your
                    role.`}
                  </div>
                  <div className="flex justify-center gap-2 items-center">
                    <Button
                      variant="link"
                      className="text-green-500 font-semibold"
                      onClick={() => {
                        router.push("/dashboard/profile");
                      }}
                    >
                      Want to change your role?
                    </Button>
                    {user?.onboardingDetails?.stepOne?.username ===
                    currentUser?.onboardingDetails?.stepOne?.username ? (
                      <Button
                        variant="link"
                        className="text-center"
                        onClick={() => {
                          setSelectedSlot(null);
                        }}
                        disabled={loading}
                      >
                        Want to pick a different slot?
                      </Button>
                    ) : null}
                  </div>
                </div>
              ) : (
                <Button
                  variant="link"
                  className="text-center w-full mt-5"
                  onClick={() => {
                    setSelectedSlot(null);
                  }}
                  disabled={loading}
                >
                  Want to pick a different slot?
                </Button>
              )}
            </form>
          </div>
        </>
      )}
    </div>
  );
}
