"use client";

import { Button } from "@/components/ui/button";
import { get } from "@/config/API";
import { getServiceDetailsEndpoint } from "@/constants/APIEndpoints";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ServiceDetails from "./_components/service-details";

const MainContainer = ({ user, username, eventURL }: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [service, setService] = useState<any>(null);
  const [showServiceDisabled, setShowServiceDisabled] = useState(false);

  const currentUser = useSelector((state: any) => state?.user?.mockCredUser);

  const router = useRouter();

  const fetchServiceDetails = async () => {
    try {
      const response = await get(
        `${getServiceDetailsEndpoint}?username=${username}&eventURL=${eventURL}`
      );
      if (response?.data?.data?.message === "ServiceDisabled") {
        setShowServiceDisabled(true);
      } else {
        setService(response?.data);
      }
    } catch (error) {
      console.log(error, "errror");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser?._id) return;
    fetchServiceDetails();
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="h-96 flex items-center">
        <Loader className="mr-2 h-8 w-8 animate-spin" />
      </div>
    );
  }

  return showServiceDisabled ? (
    <div className="p-6 text-center h-screen flex flex-col items-center justify-center gap-2">
      <h2 className="text-2xl font-semibold text-gray-800">
        Service is disabled ⚠️
      </h2>
      {username !== currentUser?.onboardingDetails?.stepOne?.username ? (
        <p className="text-gray-600">
          This service is currently unavailable. Please check back later.
        </p>
      ) : null}

      {username === currentUser?.onboardingDetails?.stepOne?.username ? (
        <div className="">
          <div className="w-[80%] text-center m-auto text-red-500">
            Seems like you changed your role to{" "}
            <span className="font-semibold">{currentUser?.role}</span> which is
            not matching this event you created where you registered yourself as{" "}
            <span className="font-semibold">
              {" "}
              {currentUser?.role === "interviewee"
                ? "interviewer"
                : "interviewee"}{" "}
            </span>{" "}
          </div>
          <Button
            variant="link"
            onClick={() => {
              router.push("/dashboard/profile");
            }}
          >
            Change role to enable this service back?
          </Button>
        </div>
      ) : (
        <Button
          variant="link"
          onClick={() => {
            router.push(`/${username}?tab=schedule`);
          }}
        >
          View other services of {user?.firstName} {user?.lastName}{" "}
        </Button>
      )}
    </div>
  ) : (
    <div className="bg-[#f3f4f6]">
      <ServiceDetails user={user} service={service} />
    </div>
  );
};

export default MainContainer;
