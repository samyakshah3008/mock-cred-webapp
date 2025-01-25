"use client";

import { fetchTestimonialsService } from "@/services/testimonials.service";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const MainContainer = () => {
  const [testimonials, setTestimonials] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState("");

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
      Main Container
      {testimonials?.map((testimonial: any, index: any) => (
        <div key={testimonial?._id}>
          <div>No. {index + 1}</div>
          <div>{testimonial?.testimonialGiverName}</div>
          <div>{testimonial?.rating}</div>
          <div>{testimonial?.testimonialText}</div>
          <div>{testimonial?.date}</div>
        </div>
      ))}
    </div>
  );
};

export default MainContainer;
