"use client";

import AvailabilityContainer from "@/components/dashboard/availability/availability-container";
import Header from "@/components/dashboard/availability/header";

const MainContainer = () => {
  return (
    <div className="flex flex-col gap-10 p-4 items-center">
      <Header />
      <AvailabilityContainer />
    </div>
  );
};

export default MainContainer;
