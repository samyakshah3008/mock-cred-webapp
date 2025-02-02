"use client";

import Header from "@/components/common/header";
import BookingContainer from "@/components/dashboard/booking/booking-container";
import { Separator } from "@/components/ui/separator";
import BookingHeader from "../../../../public/booking-header.png";

const MainContainer = () => {
  const sections = [
    <Header
      img={BookingHeader}
      alt="booking-header"
      type="image"
      headerText="Manage your"
      headerHighlightText="Bookings"
      description="See upcoming and past booked interviews through your event type links."
    />,
    <BookingContainer />,
  ];

  return (
    <div className="flex flex-col gap-10 p-4">
      {sections.map((section, id) => {
        return (
          <>
            {section}
            {id < sections.length - 1 ? <Separator /> : null}
          </>
        );
      })}
    </div>
  );
};

export default MainContainer;
