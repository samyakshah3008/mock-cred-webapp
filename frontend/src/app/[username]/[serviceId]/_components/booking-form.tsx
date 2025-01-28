"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { bookingSchema } from "@/lib/zod-validators";
import { bookNewInterviewService } from "@/services/booking.service";
import { findBookedSlotsService } from "@/services/user.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import moment from "moment";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { calculateEndTime, findExpectedRole } from "../helper";

export default function BookingForm({ event, availability }: any) {
  const [selectedDate, setSelectedDate] = useState<Date | any>(null);
  const [selectedTime, setSelectedTime] = useState<string | any>(null);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const username: any = params.username;

  const pathname = usePathname();

  const {
    service: { duration, locationURL, title, technologies },
  } = event;

  const currentUser = useSelector((state: any) => state?.user?.mockCredUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: any) => {
    const bookingData = {
      name: data.name,
      email: data.email,
      startTime: selectedTime,
      endTime: calculateEndTime(selectedDate, selectedTime, duration),
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
    } catch (error) {
      console.error("Error booking event:", error);
    } finally {
      setLoading(false);
    }
  };

  const findBookedSlots = async () => {
    if (!selectedDate) return;
    const normalizedFrontendDate = moment(selectedDate).format("YYYY-MM-DD");
    try {
      const response = await findBookedSlotsService(
        username,
        findExpectedRole(currentUser?.role),
        normalizedFrontendDate
      );
      console.log(response, "response");
    } catch (error) {
      console.error("Error finding booked slots:", error);
    }
  };

  const availableDays = availability.map((day: any) => new Date(day.date));

  const timeSlots = selectedDate
    ? availability.find(
        (day: any) => day.date === format(selectedDate, "yyyy-MM-dd")
      )?.slots || []
    : [];

  const isAvailableDay = (day: any) =>
    availableDays.some(
      (availableDay: any) => availableDay.toDateString() === day.toDateString()
    );

  useEffect(() => {
    if (selectedDate) {
      setValue("date", format(selectedDate, "yyyy-MM-dd"));
      findBookedSlots();
    }
  }, [selectedDate, setValue]);

  useEffect(() => {
    if (selectedTime) {
      setValue("time", selectedTime);
    }
  }, [selectedTime, setValue]);

  if (!currentUser?._id) {
    return <div>Please login to book.</div>;
  }

  console.log(selectedDate, "selectedDate");

  return (
    <div className="flex flex-col gap-8 p-10 border bg-white">
      <div className="md:h-96 flex flex-col md:flex-row gap-5">
        <div className="w-full">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setSelectedTime(null);
            }}
            disabled={(day) => day < new Date()}
            modifiers={{ available: availableDays }}
            modifiersStyles={{
              available: {
                background: "lightblue",
                borderRadius: 100,
              },
            }}
            className="rounded-md border"
          />
        </div>
        <div className="w-full h-full md:overflow-scroll no-scrollbar">
          {selectedDate && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Available Time Slots
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {timeSlots.map((slot: any) => (
                  <Button
                    key={slot}
                    variant={selectedTime === slot ? "default" : "outline"}
                    onClick={() => setSelectedTime(slot)}
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {selectedTime && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input {...register("name")} placeholder="Your Name" />
          </div>
          <div>
            <Input
              {...register("email")}
              type="email"
              placeholder="Your Email"
            />
          </div>
          <div>
            <Textarea
              {...register("additionalInfo")}
              placeholder="Additional Information"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Scheduling..." : "Schedule Event"}
          </Button>
        </form>
      )}
    </div>
  );
}
