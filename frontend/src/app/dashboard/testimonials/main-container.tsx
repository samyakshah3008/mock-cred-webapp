"use client";

import Header from "@/components/common/header";
import GivenTestimonialsSection from "@/components/dashboard/testimonial/given-testimonials-section";
import ReceivedTestimonialsSection from "@/components/dashboard/testimonial/received-testimonials-section";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { fetchTestimonialsService } from "@/services/testimonials.service";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TestimonialHeader from "../../../../public/testimonial-header.png";

const MainContainer = () => {
  const [testimonials, setTestimonials] = useState<any>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState("");

  const { toast } = useToast();

  const currentUser = useSelector((state: any) => state?.user?.mockCredUser);

  const fetchTestimonials = async () => {
    try {
      const response = await fetchTestimonialsService(currentRole);
      setTestimonials(response?.data?.testimonials);
    } catch (error) {
      toast({
        title: "Uh oh! failed to fetch testimonials! Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const changeActiveRole = () => {
    if (currentRole == "interviewee") {
      setCurrentRole("interviewer");
    } else {
      setCurrentRole("interviewee");
    }
  };

  const sections = [
    <Header
      headerText="Manage your"
      headerHighlightText="Testimonials"
      img={TestimonialHeader}
      alt="testimonial-header"
      description="All the testimonials you have received and given are listed here. You can edit the visibility of the testimonials you have received or change the content of the testimonials you have given. Testimonials are a great way to showcase your skills and achievements on your public profile"
      type="image"
    />,
    <ReceivedTestimonialsSection
      currentUser={currentUser}
      userRole={currentRole}
      testimonials={testimonials}
      changeActiveRole={changeActiveRole}
      fetchTestimonials={fetchTestimonials}
    />,
    <GivenTestimonialsSection
      testimonials={testimonials}
      fetchTestimonials={fetchTestimonials}
    />,
  ];

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
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader className="mr-2 h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 p-4">
      {sections.map((section: any, id: any) => {
        return (
          <>
            {section}
            {id < sections.length - 1 ? <Separator /> : null}
          </>
        );
      })}
    </div>
  );
};

export default MainContainer;
