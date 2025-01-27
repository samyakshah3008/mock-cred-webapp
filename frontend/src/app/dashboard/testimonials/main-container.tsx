"use client";

import UpdateGivenTestimonialSidesheet from "@/components/dashboard/testimonial/edit-given-testimonial-sheet";
import { Button } from "@/components/ui/button";
import {
  editVisibilityService,
  fetchTestimonialsService,
} from "@/services/testimonials.service";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const MainContainer = () => {
  const [testimonials, setTestimonials] = useState<any>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState("");
  const [showEditTestimonialEditor, setShowEditTestimonialEditor] =
    useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);

  const currentUser = useSelector((state: any) => state?.user?.mockCredUser);

  const fetchTestimonials = async () => {
    try {
      const response = await fetchTestimonialsService(currentRole);
      setTestimonials(response?.data?.testimonials);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const editVisibility = async (
    testimonialId: string,
    showOnProfile: boolean
  ) => {
    try {
      await editVisibilityService(testimonialId, currentRole, showOnProfile);
      fetchTestimonials();
    } catch (error) {
      console.log(error);
    }
  };

  const openEditTestimonialEditor = (testimonial: any) => {
    console.log(testimonial, "selected testimonial");
    setSelectedTestimonial(testimonial);
    setShowEditTestimonialEditor(true);
  };

  useEffect(() => {
    if (!currentUser?._id) return;

    if (currentUser?.role == "allrounder") {
      setCurrentRole("interviewer");
    } else if (currentUser?.role == "interviewer") {
      setCurrentRole("interviewer");
    } else {
      setCurrentRole("interviewee");
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentRole) return;

    fetchTestimonials();
  }, [currentRole]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {testimonials?.received?.length ? (
        testimonials?.received?.map((testimonial: any, index: any) => (
          <div key={testimonial?._id}>
            <div>No. {index + 1}</div>
            <div>{testimonial?.testimonialGiverName}</div>
            <div>{testimonial?.rating}</div>
            <div>{testimonial?.testimonialText}</div>
            <div>{testimonial?.date}</div>
            <Button
              onClick={() =>
                editVisibility(testimonial?._id, !testimonial?.showOnProfile)
              }
            >
              {testimonial?.showOnProfile
                ? "Make it private"
                : "Make it public"}{" "}
            </Button>
          </div>
        ))
      ) : (
        <div>No testimonials received</div>
      )}

      <hr />
      {testimonials?.given?.length ? (
        testimonials?.given?.map((testimonial: any, index: any) => (
          <div className="border-2 border-solid p-2" key={testimonial?._id}>
            <div>No. {index + 1}</div>
            <div>{testimonial?.testimonialGiverName}</div>
            <div>{testimonial?.rating}</div>
            <div>{testimonial?.testimonialText}</div>
            <div>{testimonial?.date}</div>
            <Button onClick={() => openEditTestimonialEditor(testimonial)}>
              Open Editor
            </Button>
          </div>
        ))
      ) : (
        <div>No testimonials given</div>
      )}

      <UpdateGivenTestimonialSidesheet
        show={showEditTestimonialEditor}
        setShow={setShowEditTestimonialEditor}
        fetchAllTestimonials={fetchTestimonials}
        selectedTestimonial={selectedTestimonial}
        setSelectedTestimonial={setSelectedTestimonial}
      />
    </div>
  );
};

export default MainContainer;
