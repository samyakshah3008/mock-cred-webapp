import { Testimonial } from "../models/testimonial.model.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

const getAllTestimonials = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;
  const { role } = req?.query;

  if (!role || (role !== "interviewer" && role !== "interviewee")) {
    return res.status(400).json(new ApiError(400, { role }, "Invalid role"));
  }

  try {
    const testimonials = await Testimonial.findOne({ userId });

    return res.status(200).json({
      testimonials:
        role == "interviewer"
          ? testimonials?.interviewerTestimonials || []
          : testimonials?.intervieweeTestimonials || [],
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          { message: error?.message },
          "An error occurred while fetching the testimonials"
        )
      );
  }
});

const myGivenTestimonials = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;

  try {
    const testimonials = await Testimonial.findOne({ userId });
    return res.status(200).json({
      testimonials: testimonials?.myGivenTestimonials || [],
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          { message: error?.message },
          "An error occurred while fetching the testimonials"
        )
      );
  }
});

const changeTestimonialVisibility = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;
  const { role, testimonialId, showOnProfile } = req?.body;

  if (!role || (role !== "interviewer" && role !== "interviewee")) {
    return res.status(400).json(new ApiError(400, { role }, "Invalid role"));
  }

  if (!testimonialId) {
    return res
      .status(400)
      .json(new ApiError(400, { testimonialId }, "Invalid testimonialId"));
  }

  try {
    const testimonials = await Testimonial.findOne({ userId });

    if (!testimonials) {
      return res
        .status(404)
        .json(new ApiError(404, {}, "Testimonials not found"));
    }

    const testimonialIndex = testimonials[`${role}Testimonials`].findIndex(
      (testimonial) => testimonial._id == testimonialId
    );

    if (testimonialIndex === -1) {
      return res
        .status(404)
        .json(new ApiError(404, { testimonialId }, "Testimonial not found"));
    }

    testimonials[`${role}Testimonials`][testimonialIndex].showOnProfile =
      showOnProfile;

    await testimonials.save();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Visibility changed successfully"));
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          { message: error?.message },
          "An error occurred while changing the visibility"
        )
      );
  }
});

export { changeTestimonialVisibility, getAllTestimonials, myGivenTestimonials };
