import EmptyState from "@/components/common/empty-state";
import { Loader } from "lucide-react";
import TestimonialCard from "./testimonial-card";

const Testimonials = ({
  testimonials,
  user,
  isLoading,
}: {
  testimonials: any;
  user: any;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="h-48 w-48 m-auto flex items-center justify-center">
        <Loader className="mr-2 h-8 w-8 animate-spin" />
      </div>
    );
  }
  return (
    <>
      <div className="bg-[#f3f4f6] p-10 text-sm">
        <h2 className="text-center text-2xl font-bold mb-6">
          What people say about {user?.firstName} as an Interviewee
        </h2>
        {testimonials?.interviewee?.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials?.interviewee?.map((testimonial: any, index: any) => (
              <TestimonialCard index={index} testimonial={testimonial} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No testimonials yet"
            description={`No one has given any testimonial to ${user?.firstName} yet.`}
          />
        )}
      </div>

      <div className="bg-[#f3f4f6] p-5 pt-0 text-sm">
        <h2 className="text-center text-2xl font-bold mb-6">
          What people say about {user?.firstName} as an Interviewer
        </h2>
        {testimonials?.interviewer?.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials?.interviewer?.map((testimonial: any, index: any) => (
              <TestimonialCard index={index} testimonial={testimonial} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No testimonials yet"
            description={`No one has given any testimonial to ${user?.firstName} yet.`}
          />
        )}
      </div>
    </>
  );
};

export default Testimonials;
