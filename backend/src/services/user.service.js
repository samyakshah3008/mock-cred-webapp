import { v2 as cloudinary } from "cloudinary";
import Availability from "../models/availability.model.js";
import { Booking } from "../models/booking.model.js";
import { MyServicesList } from "../models/my-services.model.js";
import { Testimonial } from "../models/testimonial.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const getUserDetailsService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, { message: "User not found" }, "User not found");
  }

  return user;
};

const checkIfOnboardingCompletedOrNotService = async (userId) => {
  const user = await User.findById(userId);

  if (user?.isOnboardingComplete) {
    return { isOnboardingComplete: true };
  } else {
    return { isOnboardingComplete: false };
  }
};

const saveOnboardingDetailsService = async (userId, detailsObj, stepCount) => {
  const findUser = await User.findById(userId);
  if (!findUser) {
    throw new ApiError(400, {}, "User not found!");
  }

  if (stepCount == 1) {
    const { socialAccountLink, username, howDoUserPlanToUseApp, role } =
      detailsObj;

    if (
      !socialAccountLink?.length ||
      !username?.length ||
      !howDoUserPlanToUseApp?.length ||
      !role?.length
    ) {
      throw new ApiError(400, {}, "Missing fields!");
    }

    const isUsernameExists = await User.findOne({
      "onboardingDetails.stepOne.username": username,
      _id: { $ne: userId },
    });

    if (isUsernameExists) {
      throw new ApiError(
        400,
        { errorData: "Username already exists" },
        "Username already exists! Please try a different username. "
      );
    }

    findUser.onboardingDetails.stepOne.socialAccountLink = socialAccountLink;
    findUser.onboardingDetails.stepOne.username = username;
    findUser.onboardingDetails.stepOne.howDoUserPlanToUseApp =
      howDoUserPlanToUseApp;

    findUser.role = role;

    await findUser.save();

    return new ApiResponse(200, {}, "Step 1 details saved successfully!");
  } else if (stepCount == 3) {
    findUser.onboardingDetails.stepThree.availability = detailsObj;

    await findUser.save();

    let newAvaibility = {
      userId,
      ...detailsObj,
    };

    await Availability.create(newAvaibility);

    return new ApiResponse(200, {}, "Step 3 details saved successfully!");
  } else if (stepCount == 4) {
    findUser.onboardingDetails.stepFour = detailsObj;

    await findUser.save();

    return new ApiResponse(200, {}, "Step 4 details saved successfully!");
  } else if (stepCount == 5) {
    findUser.onboardingDetails.stepFive = detailsObj;
    findUser.isOnboardingComplete = true;

    await findUser.save();

    return new ApiResponse(200, {}, "Step 5 details saved successfully!");
  }
};

const getCustomUserPageInformationService = async (username) => {
  const user = await User.findOne({
    "onboardingDetails.stepOne.username": username,
  }).exec();

  if (!user) {
    throw new ApiError(404, { message: "User not found" }, "User not found");
  }

  const myServicesList = await MyServicesList.findOne({
    userId: user.id,
  });

  const result = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    onboardingDetails: user.onboardingDetails,
    // services: {
    //   myServiceItems: myServicesList ? myServicesList : [],
    // },
    _id: user.id,
    role: user?.role,
  };

  return result;
};

const getServiceByUsernameAndIdService = async (username, eventURL, role) => {
  const user = await User.findOne({
    "onboardingDetails.stepOne.username": username,
  }).exec();

  if (!user) {
    throw new ApiError(404, { message: "User not found" }, "User not found");
  }

  const myServicesList = await MyServicesList.findOne({
    userId: user._id,
  }).exec();
  if (!myServicesList) {
    throw new ApiError(
      404,
      { message: "Service list not found" },
      "Service list not found"
    );
  }

  const userAvaibility = await Availability.findOne({
    userId: user._id,
  }).exec();

  if (!userAvaibility) {
    throw new ApiError(
      404,
      { message: "User avaibility not found" },
      "User avaibility not found"
    );
  }

  let serviceItem;
  let roleOfFoundServiceItem;

  serviceItem = myServicesList.interviewerServiceItems.find(
    (item) => item.url === eventURL
  );

  if (serviceItem) {
    roleOfFoundServiceItem = "interviewer";
    if (user.role === "interviewee") {
      return new ApiResponse(200, { message: "ServiceDisabled" });
    }
    if (serviceItem.isPrivate) {
      return new ApiResponse(200, {
        message: "ServiceDisabled",
        isPrivate: true,
      });
    }

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      service: serviceItem,
      userAvaibility: userAvaibility || [],
      roleOfFoundServiceItem,
    };
  }

  if (!serviceItem) {
    serviceItem = myServicesList.intervieweeServiceItems.find(
      (item) => item.url === eventURL
    );

    if (!serviceItem) {
      throw new ApiError(
        404,
        { message: "Service not found" },
        "Service not found"
      );
    }

    roleOfFoundServiceItem = "interviewee";
    if (user.role === "interviewer") {
      return new ApiResponse(200, { message: "ServiceDisabled" });
    }
    if (serviceItem.isPrivate) {
      return new ApiResponse(200, {
        message: "ServiceDisabled",
        isPrivate: true,
      });
    }

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      service: serviceItem,
      userAvaibility: userAvaibility || [],
      roleOfFoundServiceItem,
    };
  }
};

const saveStepTwoOnboardingDetailsService = async (aboutText, file, userId) => {
  const findUser = await User.findById(userId);

  // Check if a previous profile picture exists
  if (findUser?.onboardingDetails?.stepTwo?.profilePicURL) {
    // Extract the public ID from the existing Cloudinary URL
    const publicId = findUser.onboardingDetails.stepTwo.profilePicURL
      .split("/")
      .pop()
      .split(".")[0];

    // Delete the old image from Cloudinary
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new ApiError(
        400,
        { errorData: error },
        "Error while deleting previous cloudinary"
      );
    }
  }

  findUser.onboardingDetails.stepTwo.profilePicURL = file;
  findUser.onboardingDetails.stepTwo.aboutText = aboutText;
  await findUser.save();

  return new ApiResponse(
    200,
    {
      profilePicUrl: findUser.onboardingDetails.stepTwo.profilePicURL,
      aboutText: findUser.onboardingDetails.stepTwo.aboutText,
    },
    "Success"
  );
};

const saveStepTwoOnboardingAboutTextDetailsService = async (
  aboutText,
  userId
) => {
  const findUser = await User.findById(userId);
  findUser.onboardingDetails.stepTwo.aboutText = aboutText;
  await findUser.save();
  return new ApiResponse(
    200,
    {
      profilePicUrl: findUser.onboardingDetails.stepTwo.profilePicURL,
      aboutText: findUser.onboardingDetails.stepTwo.aboutText,
    },
    "Success"
  );
};

const fetchUsersAccordingToRoleService = async (role, userId) => {
  if (
    role !== "interviewer" &&
    role !== "interviewee" &&
    role !== "allrounder"
  ) {
    throw new ApiError(400, {}, "Invalid role");
  }

  if (role == "interviewer") {
    const interviewers = await User.find({ role: "interviewer" });
    const finalList = interviewers.filter(
      (interviewer) =>
        interviewer.isOnboardingComplete && interviewer._id != userId
    );
    const allrounders = await User.find({ role: "allrounder" });
    const finalListAllRounders = allrounders.filter(
      (allrounder) =>
        allrounder.isOnboardingComplete && allrounder._id != userId
    );
    return new ApiResponse(
      200,
      {
        interviewers: finalList,
        interviewees: [],
        allrounders: finalListAllRounders,
      },
      "Success"
    );
  } else if (role == "interviewee") {
    const interviewees = await User.find({ role: "interviewee" });
    const finalList = interviewees.filter(
      (interviewee) =>
        interviewee.isOnboardingComplete && interviewee._id != userId
    );
    const allrounders = await User.find({ role: "allrounder" });
    const finalListAllRounders = allrounders.filter(
      (allrounder) =>
        allrounder.isOnboardingComplete && allrounder._id != userId
    );

    return new ApiResponse(
      200,
      {
        interviewers: [],
        interviewees: finalList,
        allrounders: finalListAllRounders,
      },
      "Success"
    );
  } else {
    const interviewers = await User.find({ role: "interviewer" });
    const finalListInterviewers = interviewers.filter(
      (interviewer) =>
        interviewer.isOnboardingComplete && interviewer._id != userId
    );

    const interviewees = await User.find({ role: "interviewee" });
    const finalListInterviewees = interviewees.filter(
      (interviewee) =>
        interviewee.isOnboardingComplete && interviewee._id != userId
    );

    const allrounders = await User.find({ role: "allrounder" });
    const finalListAllRounders = allrounders.filter(
      (allrounder) =>
        allrounder.isOnboardingComplete && allrounder._id != userId
    );

    return new ApiResponse(
      200,
      {
        interviewers: finalListInterviewers,
        interviewees: finalListInterviewees,
        allrounders: finalListAllRounders,
      },
      "Success"
    );
  }
};

const getAggregateStatisticsService = async (username) => {
  if (!username) {
    throw new ApiError(400, {}, "Username is required");
  }

  const user = await User.findOne({
    "onboardingDetails.stepOne.username": username,
  });

  if (!user) {
    throw new ApiError(404, {}, "User not found");
  }

  let aggregateStatistics = {
    mockInterviewsGiven: -1,
    mockInterviewsTaken: -1,
    mockIntervieweeRatings: -1,
    mockInterviewerRatings: -1,
    mockIntervieweeTestimonials: -1,
    mockInterviewerTestimonials: -1,
  };

  const findUserBooking = await Booking.findOne({ userId: user.id });
  const findUserTestimonial = await Testimonial.findOne({ userId: user.id });

  if (findUserBooking) {
    // prepare for interviewee statistics

    const findApprovedIntervieweeBookings =
      findUserBooking.intervieweeBookings.filter(
        (booking) => booking.status === "approved"
      );

    if (findApprovedIntervieweeBookings.length > 0) {
      aggregateStatistics.mockInterviewsGiven =
        findApprovedIntervieweeBookings.length;

      const findIntervieweeTestimonials =
        findUserTestimonial.intervieweeTestimonials;
      aggregateStatistics.mockIntervieweeTestimonials =
        findIntervieweeTestimonials.length;

      const intervieweeRating = findIntervieweeTestimonials.reduce(
        (acc, curr) => {
          return acc + curr.rating;
        },
        0
      );

      aggregateStatistics.mockIntervieweeRatings = Math.floor(
        intervieweeRating / findIntervieweeTestimonials.length
      );
    }

    const findApprovedInterviewerBookings =
      findUserBooking.interviewerBookings.filter(
        (booking) => booking.status === "approved"
      );

    if (findApprovedInterviewerBookings.length > 0) {
      aggregateStatistics.mockInterviewsTaken =
        findApprovedInterviewerBookings.length;

      const findInterviewerTestimonials =
        findUserTestimonial.interviewerTestimonials;
      aggregateStatistics.mockInterviewerTestimonials =
        findInterviewerTestimonials.length;

      const interviewerRating = findInterviewerTestimonials.reduce(
        (acc, curr) => {
          return acc + curr.rating;
        },
        0
      );

      aggregateStatistics.mockInterviewerRatings =
        interviewerRating / findInterviewerTestimonials.length;
    }
  }

  return new ApiResponse(200, { aggregateStatistics }, "Success");
};

const getUsersForMockInterviewsService = async (requiredRole, userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, {}, "User not found");
  }

  if (!["interviewer", "interviewee"].includes(requiredRole)) {
    throw new ApiError(400, {}, "Invalid role");
  }

  const users = await User.aggregate([
    {
      $match: {
        $or: [{ role: requiredRole }, { role: "allrounder" }],
        _id: { $ne: user._id },
        isOnboardingComplete: true,
      },
    },
    {
      $project: {
        _id: 1,
        profilePicURL: "$onboardingDetails.stepTwo.profilePicURL",
        position: "$onboardingDetails.stepFive.position",
        company: "$onboardingDetails.stepFive.company",
        preferredTechnologies: "$onboardingDetails.stepFive.preferredTechStack",
        socialLinks: "$onboardingDetails.stepFour.socialLinks",
        username: "$onboardingDetails.stepOne.username",
        yearsOfExperience: "$onboardingDetails.stepFive.yearsOfExperience",
        firstName: 1,
        lastName: 1,
      },
    },
  ]);

  return users;
};

export {
  checkIfOnboardingCompletedOrNotService,
  fetchUsersAccordingToRoleService,
  getAggregateStatisticsService,
  getCustomUserPageInformationService,
  getServiceByUsernameAndIdService,
  getUserDetailsService,
  getUsersForMockInterviewsService,
  saveOnboardingDetailsService,
  saveStepTwoOnboardingAboutTextDetailsService,
  saveStepTwoOnboardingDetailsService,
};
