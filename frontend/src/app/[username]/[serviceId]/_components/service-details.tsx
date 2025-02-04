"use client";

import { Button } from "@/components/ui/button";
import { notFound, useRouter } from "next/navigation";
import { useState } from "react";
import { prepareAvailableDays } from "../helper";
import BookingForm from "./booking-form";
import SuccessScreen from "./success-screen";

export default function ServiceDetails({ user, service }: any) {
  if (!service) {
    notFound();
  }

  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const {
    title = "",
    email,
    firstName,
    service: { duration, description, locationURL },
    userAvaibility,
  } = service;

  const availableDays = prepareAvailableDays(userAvaibility, duration);

  if (showSuccessScreen) {
    return <SuccessScreen />;
  }

  return (
    <div className="m-auto w-[1040px] flex flex-col gap-5 items-center justify-center h-screen">
      <Button
        variant="link"
        onClick={() =>
          router.push(
            `/${user?.onboardingDetails?.stepOne?.username}?tab=schedule`
          )
        }
        disabled={loading}
        className="underline"
      >
        Want to check out other services of {user?.firstName}?{" "}
      </Button>
      <BookingForm
        user={user}
        event={service}
        availability={availableDays}
        setShowSuccessScreen={setShowSuccessScreen}
        loading={loading}
        setLoading={setLoading}
      />
    </div>
  );
}
