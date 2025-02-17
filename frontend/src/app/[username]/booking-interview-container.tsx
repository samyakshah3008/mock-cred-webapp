"use client";

import { Loader } from "lucide-react";
import EmptyState from "./empty-state";
import ServiceItem from "./serviceItem";

const BookingInterviewContainer = ({
  username,
  user,
  isLoading,
  eventsList,
}: any) => {
  if (isLoading) {
    return (
      <div className="h-48 w-48 m-auto flex items-center justify-center">
        <Loader className="mr-2 h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (
    !eventsList?.intervieweeServiceItems?.length &&
    !eventsList?.interviewerServiceItems?.length
  ) {
    return <EmptyState />;
  }

  return (
    <div
      className="rounded-md border-subtle border w-full md:w-[700px] m-auto bg-white mt-5"
      data-testid="event-types"
    >
      {user?.role == "interviewee" ? (
        <div className="p-4">
          <div className="text-sm underline text-center mb-4 font-semibold">
            Take {user?.firstName}'s Mock Interview:{" "}
          </div>
          {eventsList?.intervieweeServiceItems?.length ? (
            eventsList?.intervieweeServiceItems?.map(
              (option: any, index: any) => (
                <ServiceItem
                  option={option}
                  index={index}
                  username={username}
                />
              )
            )
          ) : (
            <div className="text-sm text-center mt-5">
              No events created by {user?.firstName}, please check back later.{" "}
            </div>
          )}
        </div>
      ) : user?.role == "interviewer" ? (
        <div className="p-4">
          <div className="text-sm underline text-center mb-4 mt-4 font-semibold">
            Give Mock Interview with {user?.firstName}:{" "}
          </div>
          {eventsList?.interviewerServiceItems?.length ? (
            eventsList?.interviewerServiceItems?.map(
              (option: any, index: any) => (
                <ServiceItem
                  option={option}
                  index={index}
                  username={username}
                />
              )
            )
          ) : (
            <div className="text-sm text-center mt-5">
              No events created by {user?.firstName}, please check back later.{" "}
            </div>
          )}
        </div>
      ) : (
        <div className="p-4">
          <div className="text-sm underline text-center mb-4 font-semibold">
            Take {user?.firstName}'s Mock Interview:{" "}
          </div>
          {eventsList?.intervieweeServiceItems?.length ? (
            eventsList?.intervieweeServiceItems?.map(
              (option: any, index: any) => (
                <ServiceItem
                  option={option}
                  index={index}
                  username={username}
                />
              )
            )
          ) : (
            <div className="text-sm text-center mt-5">
              No events created by {user?.firstName}, please check back later.{" "}
            </div>
          )}
          <div className="text-sm underline text-center mb-4 mt-4 font-semibold">
            Give Mock Interview with {user?.firstName}:{" "}
          </div>
          {eventsList?.interviewerServiceItems?.length ? (
            eventsList?.interviewerServiceItems?.map(
              (option: any, index: any) => (
                <ServiceItem
                  option={option}
                  index={index}
                  username={username}
                />
              )
            )
          ) : (
            <div className="text-sm text-center mt-5">
              No events created by {user?.firstName}, please check back later.{" "}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingInterviewContainer;
