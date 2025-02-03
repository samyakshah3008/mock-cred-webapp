"use client";

import EmptyState from "@/components/common/empty-state";
import GivenTestimonialDataTable from "./given-testimonial-data-table";

const GivenTestimonialsSection = ({
  testimonials,
  fetchTestimonials,
}: {
  testimonials: any;
  fetchTestimonials: any;
}) => {
  return testimonials?.given?.length ? (
    <GivenTestimonialDataTable
      data={testimonials?.given || []}
      fetchTestimonials={fetchTestimonials}
    />
  ) : (
    <div className="flex flex-col gap-2">
      <div className="text-orange-500 font-bold text-center underline mb-5">
        Take a look at testimonials you gave to people:{" "}
      </div>
      <EmptyState
        title="No testimonials given"
        description="You have not given any testimonials yet. Give/Take mock interviews and approve someone's booking to give them testimonials."
      />
    </div>
  );
};

export default GivenTestimonialsSection;
