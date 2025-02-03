"use client";

import EmptyState from "@/components/common/empty-state";
import { useRouter } from "next/navigation";
import Filters from "./filters";
import ReceivedTestimonialDataTable from "./received-testimonial-data-table";

const ReceivedTestimonialsSection = ({
  testimonials,
  userRole,
  currentUser,
  changeActiveRole,
  fetchTestimonials,
}: {
  testimonials: any;
  currentUser: any;
  userRole: any;
  changeActiveRole: any;
  fetchTestimonials: any;
}) => {
  const router = useRouter();

  const changeRoleHandler = () => {
    router.push("/dashboard/profile");
  };

  return (
    <div className="flex flex-col gap-4">
      <Filters
        currentUser={currentUser}
        userRole={userRole}
        changeActiveRole={changeActiveRole}
        changeRoleHandler={changeRoleHandler}
      />

      {testimonials?.received?.length ? (
        <ReceivedTestimonialDataTable
          data={testimonials?.received || []}
          currentRole={userRole}
          fetchTestimonials={fetchTestimonials}
        />
      ) : (
        <div className="flex flex-col gap-2">
          <div className="text-orange-500 font-bold text-center underline mb-5">
            Take a look at testimonials people gave you:{" "}
          </div>
          <EmptyState
            title="No testimonials received"
            description="You have not received any testimonials yet. Give/Take mock interviews and get your booking approved to receive testimonials."
          />
        </div>
      )}
    </div>
  );
};

export default ReceivedTestimonialsSection;
