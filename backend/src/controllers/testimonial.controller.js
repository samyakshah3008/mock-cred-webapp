import { Testimonial } from "../models/testimonial.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
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
          ? {
              received: testimonials?.interviewerTestimonials || [],
              given: testimonials?.myGivenTestimonials || [],
            }
          : {
              received: testimonials?.intervieweeTestimonials || [],
              given: testimonials?.myGivenTestimonials || [],
            },
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

const getPublicProfileAllTestimonials = asyncHandler(async (req, res) => {
  const userId = req?.query?.userId;

  if (!userId) {
    return res
      .status(400)
      .json(new ApiError(400, { userId }, "Invalid userId"));
  }

  const User = await Testimonial.findOne({ userId });

  if (!User) {
    return res
      .status(404)
      .json(new ApiError(404, { userId }, "User not found"));
  }

  return res.status(200).json({
    testimonials: {
      interviewer: User?.interviewerTestimonials || [],
      interviewee: User?.intervieweeTestimonials || [],
    },
  });
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

const updateGivenTestimonial = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;
  const {
    testimonialId,
    testimonialReceiverUserId,
    rating,
    testimonialText,
    feedbackText,
  } = req?.body;

  if (!testimonialId || !testimonialReceiverUserId) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          { testimonialId, testimonialReceiverUserId },
          "Invalid testimonialId or testimonialReceiverUserId"
        )
      );
  }

  if (!rating || !testimonialText || !feedbackText) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          { rating, testimonialText, feedbackText },
          "Rating, testimonialText, and feedbackText are required"
        )
      );
  }

  try {
    const findGiverTestimonial = await Testimonial.findOne({ userId });
    if (!findGiverTestimonial) {
      return res
        .status(404)
        .json(new ApiError(404, {}, "Testimonial not found"));
    }

    const findParticularGiverTestimonial =
      findGiverTestimonial.myGivenTestimonials.find(
        (testimonial) => testimonial.testimonialId === testimonialId
      );
    if (!findParticularGiverTestimonial) {
      return res
        .status(404)
        .json(new ApiError(404, {}, "Testimonial not found"));
    }
    findParticularGiverTestimonial.rating = rating;
    findParticularGiverTestimonial.testimonialText = testimonialText;
    findParticularGiverTestimonial.feedbackText = feedbackText;

    await findGiverTestimonial.save();

    /////////////////////////////

    const findReceiverTestimonial = await Testimonial.findOne({
      userId: testimonialReceiverUserId,
    });

    if (!findReceiverTestimonial) {
      return res
        .status(404)
        .json(new ApiError(404, {}, "Testimonial not found"));
    }

    const findParticularTestimonial1 =
      findReceiverTestimonial.interviewerTestimonials.find(
        (testimonial) => testimonial.testimonialId === testimonialId
      );

    if (findParticularTestimonial1?.id) {
      findParticularTestimonial1.rating = rating;
      findParticularTestimonial1.testimonialText = testimonialText;
      findParticularTestimonial1.feedbackText = feedbackText;

      await findReceiverTestimonial.save();

      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Testimonial updated successfully"));
    } else {
      const findParticularTestimonial2 =
        findReceiverTestimonial.intervieweeTestimonials.find(
          (testimonial) => testimonial.testimonialId === testimonialId
        );

      if (findParticularTestimonial2?.id) {
        findParticularTestimonial2.rating = rating;
        findParticularTestimonial2.testimonialText = testimonialText;
        findParticularTestimonial2.feedbackText = feedbackText;

        await findReceiverTestimonial.save();

        return res
          .status(200)
          .json(new ApiResponse(200, {}, "Testimonial updated successfully"));
      } else {
        return res
          .status(404)
          .json(new ApiError(404, {}, "Testimonial not found"));
      }
    }
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
          "An error occurred while deleting the testimonial"
        )
      );
  }
});

const deleteGivenTestimonial = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;
  const { testimonialId, testimonialReceiverUserId } = req?.query;

  if (!testimonialId || !testimonialReceiverUserId) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          { testimonialId, testimonialReceiverUserId },
          "Invalid testimonialId or testimonialReceiverUserId"
        )
      );
  }

  try {
    const findGiverTestimonial = await Testimonial.findOne({ userId });
    if (!findGiverTestimonial) {
      return res
        .status(404)
        .json(new ApiError(404, {}, "Testimonial not found"));
    }
    findGiverTestimonial.myGivenTestimonials =
      findGiverTestimonial.myGivenTestimonials.filter(
        (testimonial) => testimonial.testimonialId !== testimonialId
      );
    await findGiverTestimonial.save();

    const findReceiverTestimonial = await Testimonial.findOne({
      userId: testimonialReceiverUserId,
    });
    const findTestimonial1 =
      findReceiverTestimonial.interviewerTestimonials.filter(
        (testimonial) => testimonial?.testimonialId === testimonialId
      );
    if (findTestimonial1.length > 0) {
      findReceiverTestimonial.interviewerTestimonials =
        findReceiverTestimonial.interviewerTestimonials.filter(
          (testimonial) => testimonial?.testimonialId !== testimonialId
        );
      await findReceiverTestimonial.save();

      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Testimonial deleted successfully"));
    } else {
      const findTestimonial2 =
        findReceiverTestimonial.intervieweeTestimonials.filter(
          (testimonial) => testimonial?.testimonialId === testimonialId
        );
      if (findTestimonial2.length > 0) {
        findReceiverTestimonial.intervieweeTestimonials =
          findReceiverTestimonial.intervieweeTestimonials.filter(
            (testimonial) => testimonial?.testimonialId !== testimonialId
          );
        await findReceiverTestimonial.save();

        return res
          .status(200)
          .json(new ApiResponse(200, {}, "Testimonial deleted successfully"));
      } else {
        return res
          .status(404)
          .json(new ApiError(404, {}, "Testimonial not found"));
      }
    }
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
          "An error occurred while deleting the testimonial"
        )
      );
  }
});

export {
  changeTestimonialVisibility,
  deleteGivenTestimonial,
  getAllTestimonials,
  getPublicProfileAllTestimonials,
  updateGivenTestimonial,
};
