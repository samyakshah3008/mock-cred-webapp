"use client";

import { get } from "@/config/API";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import AvailabilityForm from "./avaibility-form";
import { defaultAvailability } from "./constants";

const MainContainer = () => {
  const [isFetchingAvaibilityData, setIsFetchingAvaibilityData] =
    useState(true);
  const [avaibilityData, setAvaibilityData] = useState<any>(null);

  const { toast } = useToast();

  const fetchAvaibilityData = async () => {
    try {
      const response = await get("");
      setAvaibilityData(response?.data?.data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Oops, failed to delete your item from My Services list! ⚠️",
        description:
          "We are extremely sorry for this, please try again later. Appreciate your patience meanwhile we fix!",
      });
    } finally {
      setIsFetchingAvaibilityData(false);
    }
  };

  useEffect(() => {
    fetchAvaibilityData();
  }, []);

  if (isFetchingAvaibilityData) {
    return (
      <div className="h-96 flex items-center">
        <Loader className="mr-2 h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <AvailabilityForm
        initialData={avaibilityData || defaultAvailability}
        fetchAvaibilityData={fetchAvaibilityData}
      />
    </div>
  );
};

export default MainContainer;
