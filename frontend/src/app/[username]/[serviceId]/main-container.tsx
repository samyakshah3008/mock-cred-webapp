"use client";

import { get } from "@/config/API";
import { getServiceDetailsEndpoint } from "@/constants/APIEndpoints";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import ServiceDetails from "./_components/service-details";

const MainContainer = ({ username, eventURL }: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [service, setService] = useState<any>(null);

  const fetchServiceDetails = async () => {
    try {
      const response = await get(
        `${getServiceDetailsEndpoint}?username=${username}&eventURL=${eventURL}`
      );
      setService(response?.data);
    } catch (error) {
      console.log(error, "errror");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceDetails();
  }, []);

  if (isLoading) {
    return (
      <div className="h-96 flex items-center">
        <Loader className="mr-2 h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <ServiceDetails service={service} />
    </div>
  );
};

export default MainContainer;
