import moment from "moment";
import {
  prepareApproveBookingEmailContent,
  prepareCancelBookingEmailContent,
  prepareRescheduleBookingEmailContent,
  prepareUnconfirmedBookingEmailContent,
  prepareUpcomingBookingEmailContent,
} from "../helpers/booking.js";
import { Booking } from "../models/booking.model.js";
import { Testimonial } from "../models/testimonial.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mailSender from "../utils/mail-sender.js";

const getAllBookings = asyncHandler(async (req, res) => {
  const user = req?.user;
  try {
    const userBooking = await Booking.findOne({ userId: user._id });
    if (!userBooking) {
      return res.status(200).json({ bookings: [] });
    }

    // now we will traverse through both interviewee and interviewers booking and check if we need to make any change in the status

    // traversing interviewee bookings

    for (let i = 0; i < userBooking.intervieweeBookings.length; i++) {
      const booking = userBooking.intervieweeBookings[i];

      const bookingDate = moment(booking.date);
      const endTime = booking.endTime;

      const endDateTime = moment(
        `${bookingDate.format("YYYY-MM-DD")} ${endTime}`,
        "YYYY-MM-DD HH:mm"
      );
      // const currentTime = moment("2025-01-13 10:31", "YYYY-MM-DD HH:mm");

      const currentTime = moment();

      // Compare currentTime with endDateTime
      if (currentTime.isAfter(endDateTime)) {
        booking.status = "past";
      }
    }

    // traversing interviewer bookings

    for (let i = 0; i < userBooking.interviewerBookings.length; i++) {
      const booking = userBooking.interviewerBookings[i];

      const bookingDate = moment(booking.date);
      const endTime = booking.endTime;

      const endDateTime = moment(
        `${bookingDate.format("YYYY-MM-DD")} ${endTime}`,
        "YYYY-MM-DD HH:mm"
      );
      // const currentTime = moment("2025-01-13 10:31", "YYYY-MM-DD HH:mm");

      const currentTime = moment();

      // Compare currentTime with endDateTime
      if (currentTime.isAfter(endDateTime)) {
        booking.status = "past";
      }
    }

    await userBooking.save();

    return res.status(200).json({ bookings: userBooking });
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
          "An error occurred while fetching the bookings"
        )
      );
  }
});

const addNewBooking = asyncHandler(async (req, res) => {
  const { bookingData } = req.body;
  const user = req?.user;
  const {
    date,
    startTime,
    endTime,
    status,
    locationURL,
    organizerUsername,
    additionalInfo,
    duration,
    role,
    bookingLink,
    bookingTitle,
    interviewTechStacks,
  } = bookingData;

  if (
    !date ||
    !startTime ||
    !endTime ||
    !organizerUsername ||
    !duration ||
    !locationURL ||
    !role ||
    !bookingLink ||
    bookingTitle ||
    !interviewTechStacks?.length
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  let meetingId = Math.random().toString(36).substring(7);

  try {
    const findOrganizer = await User.findOne({
      "onboardingDetails.stepOne.username": organizerUsername,
    });

    if (!findOrganizer) {
      return res.status(400).json({ error: "Organizer not found" });
    }

    let newMeeting;

    // if user role is interviewer

    if (role == "interviewer") {
      newMeeting = {
        participantInformation: {
          interviewee: {
            email: findOrganizer.email,
            name: `${findOrganizer.firstName} ${findOrganizer.lastName}`,
          },
          interviewer: {
            email: user?.email,
            name: `${user.firstName} ${user.lastName}`,
          },
        },
        date,
        startTime,
        endTime,
        status: status || "upcoming",
        locationURL: locationURL || null,
        additionalInfo: additionalInfo || null,
        meetingId,
        bookingLink,
        bookingTitle,
        interviewTechStacks,
      };
    } else if (role == "interviewee") {
      newMeeting = {
        participantInformation: {
          interviewee: {
            email: user?.email,
            name: `${user.firstName} ${user.lastName}`,
          },
          interviewer: {
            email: findOrganizer.email,
            name: `${findOrganizer.firstName} ${findOrganizer.lastName}`,
          },
        },
        date,
        startTime,
        endTime,
        status: status || "upcoming",
        locationURL: locationURL || null,
        additionalInfo: additionalInfo || null,
        meetingId,
        bookingLink,
        bookingTitle,
        interviewTechStacks,
      };
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    let organizerBooking = await Booking.findOne({
      userId: findOrganizer.id,
    });
    if (!organizerBooking) {
      organizerBooking = new Booking({ userId: findOrganizer.id });
    }

    if (role == "interviewer") {
      organizerBooking.intervieweeBookings.push(newMeeting);
    } else if (role == "interviewee") {
      organizerBooking.interviewerBookings.push(newMeeting);
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    await organizerBooking.save();

    let participantBooking = await Booking.findOne({ userId: user._id });
    if (!participantBooking) {
      participantBooking = new Booking({ userId: user._id });
    }

    if (role == "interviewer") {
      participantBooking.interviewerBookings.push(newMeeting);
    } else if (role == "interviewee") {
      participantBooking.intervieweeBookings.push(newMeeting);
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    await participantBooking.save();

    // Send Email Invitations
    const emailContent = `
      <h2>New Interview Scheduled</h2>
      <p><strong>What:</strong> ${duration} Min Meeting between ${
      user.firstName
    } ${user.lastName} and ${findOrganizer.firstName} ${
      findOrganizer.lastName
    }</p>
      <p><strong>When:</strong> ${new Date(
        date
      ).toDateString()} | ${startTime} - ${endTime} (Asia/Calcutta)</p>
      <p><strong>Who:</strong></p>
      <ul>
        <li>${findOrganizer.firstName} ${findOrganizer.lastName} - Organizer ${
      findOrganizer.email
    } </li>
        <li>${user.firstName} ${user.lastName} - Guest ${user.email}</li>
      </ul>
      <p><strong>Where:</strong> Google Meet</p>
      <p>Meeting URL: <a href="${locationURL}">${locationURL}</a></p>
      <div>Booked from ${bookingLink} </div>
    `;

    await mailSender(
      [user.email, findOrganizer.email],
      "New Interview Scheduled",
      emailContent
    );

    return res
      .status(201)
      .json({ message: "Interview scheduled successfully and emails sent" });
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
          "An error occurred while scheduling the interview"
        )
      );
  }
});

const changeBookingStatus = asyncHandler(async (req, res) => {
  const { meetingId, role, status, reason, bookingLink } = req.body;
  const user = req?.user;

  if (!meetingId || !role || !status || !bookingLink) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (role !== "interviewer" && role !== "interviewee") {
    return res.status(400).json({ error: "Invalid role" });
  }

  if (
    status != "canceled" &&
    status != "upcoming" &&
    status != "unconfirmed" &&
    status != "rescheduled"
  ) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    if (role === "interviewer") {
      let userBooking = await Booking.findOne(
        { interviewerBookings: { $elemMatch: { meetingId: meetingId } } },
        { "interviewerBookings.$": 1 }
      );
      let user2Booking = await Booking.findOne(
        { intervieweeBookings: { $elemMatch: { meetingId: meetingId } } },
        { "intervieweeBookings.$": 1 }
      );

      if (!userBooking || !user2Booking) {
        return res.status(400).json({ error: "Booking not found" });
      }

      const findUserBooking = await Booking.findOne({ _id: userBooking.id });

      if (!findUserBooking) {
        return res.status(400).json({ error: "Booking not found" });
      }

      const findParticularUserBooking =
        findUserBooking.interviewerBookings.filter(
          (item) => item.meetingId === meetingId
        );

      if (!findParticularUserBooking) {
        return res.status(400).json({ error: "Booking not found" });
      }

      if (findParticularUserBooking[0].status == status) {
        return res
          .status(400)
          .json({ error: "Booking status is already same" });
      }

      if (status == "rescheduled") {
        findParticularUserBooking[0].status = "canceled";
      } else {
        findParticularUserBooking[0].status = status;
      }

      const findUser2Booking = await Booking.findOne({ _id: user2Booking.id });
      if (!findUser2Booking) {
        return res.status(400).json({ error: "Booking not found" });
      }

      const findParticularUser2Booking =
        findUser2Booking.intervieweeBookings.filter(
          (item) => item.meetingId === meetingId
        );
      if (!findParticularUser2Booking) {
        return res.status(400).json({ error: "Booking not found" });
      }

      if (findParticularUser2Booking[0].status == status) {
        return res
          .status(400)
          .json({ error: "Booking status is already same" });
      }

      if (status == "rescheduled") {
        findParticularUser2Booking[0].status = "canceled";
      } else {
        findParticularUser2Booking[0].status = status;
      }

      await findUserBooking.save();
      await findUser2Booking.save();

      const { date, startTime, endTime, locationURL } =
        findParticularUserBooking[0];

      if (status == "canceled") {
        const emailContent = prepareCancelBookingEmailContent(
          findParticularUserBooking[0].participantInformation.interviewer.name,
          findParticularUserBooking[0].participantInformation.interviewer.email,
          findParticularUser2Booking[0].participantInformation.interviewee.name,
          findParticularUser2Booking[0].participantInformation.interviewee
            .email,
          date,
          startTime,
          endTime,
          locationURL,
          reason
        );

        await mailSender(
          [
            findParticularUserBooking[0].participantInformation.interviewer
              .email,
            findParticularUser2Booking[0].participantInformation.interviewee
              .email,
          ],
          "Interview Cancelled!",
          emailContent
        );
      } else if (status == "upcoming") {
        const emailContent = prepareUpcomingBookingEmailContent(
          findParticularUserBooking[0].participantInformation.interviewer.name,
          findParticularUserBooking[0].participantInformation.interviewer.email,
          findParticularUser2Booking[0].participantInformation.interviewee.name,
          findParticularUser2Booking[0].participantInformation.interviewee
            .email,
          date,
          startTime,
          endTime,
          locationURL,
          reason
        );

        await mailSender(
          [
            findParticularUserBooking[0].participantInformation.interviewer
              .email,
            findParticularUser2Booking[0].participantInformation.interviewee
              .email,
          ],

          "Interview Status Changed to Upcoming!",
          emailContent
        );
      } else if (status == "unconfirmed") {
        const emailContent = prepareUnconfirmedBookingEmailContent(
          findParticularUserBooking[0].participantInformation.interviewer.name,
          findParticularUserBooking[0].participantInformation.interviewer.email,
          findParticularUser2Booking[0].participantInformation.interviewee.name,
          findParticularUser2Booking[0].participantInformation.interviewee
            .email,
          date,
          startTime,
          endTime,
          locationURL,
          reason
        );

        await mailSender(
          [
            findParticularUserBooking[0].participantInformation.interviewer
              .email,
            findParticularUser2Booking[0].participantInformation.interviewee
              .email,
          ],
          "Interview Status moved to Unconfirmed!",
          emailContent
        );
      } else if (status == "rescheduled") {
        const emailContent = prepareRescheduleBookingEmailContent(
          findParticularUserBooking[0].participantInformation.interviewer.name,
          findParticularUserBooking[0].participantInformation.interviewer.email,
          findParticularUser2Booking[0].participantInformation.interviewee.name,
          findParticularUser2Booking[0].participantInformation.interviewee
            .email,
          date,
          startTime,
          endTime,
          locationURL,
          reason,
          bookingLink
        );

        await mailSender(
          [
            findParticularUserBooking[0].participantInformation.interviewer
              .email,
            findParticularUser2Booking[0].participantInformation.interviewee
              .email,
          ],
          "Request for Reschedule!",
          emailContent
        );
      } else {
        return res.status(400).json({ error: "Invalid status" });
      }

      return res.status(200).json({ message: "Booking status changed" });
    } else {
      let userBooking = await Booking.findOne(
        { intervieweeBookings: { $elemMatch: { meetingId: meetingId } } },
        { "intervieweeBookings.$": 1 }
      );
      let user2Booking = await Booking.findOne(
        { interviewerBookings: { $elemMatch: { meetingId: meetingId } } },
        { "interviewerBookings.$": 1 }
      );

      if (!userBooking || !user2Booking) {
        return res.status(400).json({ error: "Booking not found" });
      }

      const findUserBooking = await Booking.findOne({ _id: userBooking.id });

      if (!findUserBooking) {
        return res.status(400).json({ error: "Booking not found" });
      }

      const findParticularUserBooking =
        findUserBooking.intervieweeBookings.filter(
          (item) => item.meetingId === meetingId
        );

      if (!findParticularUserBooking) {
        return res.status(400).json({ error: "Booking not found" });
      }

      if (findParticularUserBooking[0].status == status) {
        return res
          .status(400)
          .json({ error: "Booking status is already same" });
      }

      if (status == "rescheduled") {
        findParticularUserBooking[0].status = "canceled";
      } else {
        findParticularUserBooking[0].status = status;
      }

      const findUser2Booking = await Booking.findOne({ _id: user2Booking.id });
      if (!findUser2Booking) {
        return res.status(400).json({ error: "Booking not found" });
      }

      const findParticularUser2Booking =
        findUser2Booking.interviewerBookings.filter(
          (item) => item.meetingId === meetingId
        );
      if (!findParticularUser2Booking) {
        return res.status(400).json({ error: "Booking not found" });
      }

      if (findParticularUser2Booking[0].status == status) {
        return res
          .status(400)
          .json({ error: "Booking status is already same" });
      }

      if (status == "rescheduled") {
        findParticularUser2Booking[0].status = "canceled";
      } else {
        findParticularUser2Booking[0].status = status;
      }
      await findUserBooking.save();
      await findUser2Booking.save();

      const { date, startTime, endTime, locationURL } =
        findParticularUserBooking[0];

      if (status == "canceled") {
        const emailContent = prepareCancelBookingEmailContent(
          findParticularUserBooking[0].participantInformation.interviewee.name,
          findParticularUserBooking[0].participantInformation.interviewee.email,
          findParticularUser2Booking[0].participantInformation.interviewer.name,
          findParticularUser2Booking[0].participantInformation.interviewer
            .email,
          date,
          startTime,
          endTime,
          locationURL,
          reason
        );

        await mailSender(
          [
            findParticularUserBooking[0].participantInformation.interviewee
              .email,
            findParticularUser2Booking[0].participantInformation.interviewer
              .email,
          ],
          "Interview Cancelled!",
          emailContent
        );
      } else if (status == "upcoming") {
        const emailContent = prepareUpcomingBookingEmailContent(
          findParticularUserBooking[0].participantInformation.interviewee.name,
          findParticularUserBooking[0].participantInformation.interviewee.email,
          findParticularUser2Booking[0].participantInformation.interviewer.name,
          findParticularUser2Booking[0].participantInformation.interviewer
            .email,
          date,
          startTime,
          endTime,
          locationURL,
          reason
        );

        await mailSender(
          [
            findParticularUserBooking[0].participantInformation.interviewee
              .email,
            findParticularUser2Booking[0].participantInformation.interviewer
              .email,
          ],
          "Interview Status Changed to Upcoming!",
          emailContent
        );
      } else if (status == "unconfirmed") {
        const emailContent = prepareUnconfirmedBookingEmailContent(
          findParticularUserBooking[0].participantInformation.interviewee.name,
          findParticularUserBooking[0].participantInformation.interviewee.email,
          findParticularUser2Booking[0].participantInformation.interviewer.name,
          findParticularUser2Booking[0].participantInformation.interviewer
            .email,
          date,
          startTime,
          endTime,
          locationURL,
          reason
        );

        await mailSender(
          [
            findParticularUserBooking[0].participantInformation.interviewee
              .email,
            findParticularUser2Booking[0].participantInformation.interviewer
              .email,
          ],
          "Interview Status moved to Unconfirmed!",
          emailContent
        );
      } else if (status == "rescheduled") {
        const emailContent = prepareRescheduleBookingEmailContent(
          findParticularUserBooking[0].participantInformation.interviewee.name,
          findParticularUserBooking[0].participantInformation.interviewee.email,
          findParticularUser2Booking[0].participantInformation.interviewer.name,
          findParticularUser2Booking[0].participantInformation.interviewer
            .email,
          date,
          startTime,
          endTime,
          locationURL,
          reason,
          bookingLink
        );

        await mailSender(
          [
            findParticularUserBooking[0].participantInformation.interviewee
              .email,
            findParticularUser2Booking[0].participantInformation.interviewer
              .email,
          ],
          "Request for Reschedule!",
          emailContent
        );
      } else {
        return res.status(400).json({ error: "Invalid status" });
      }

      return res.status(200).json({ message: "Booking status changed" });
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
          "An error occurred while moving the booking to unconfirmed"
        )
      );
  }
});

const approveBooking = asyncHandler(async (req, res) => {
  const {
    meetingId,
    role,
    testimonialText,
    rating,
    feedbackText,
    testimonialGiverPublicProfile,
    interviewDetails,
  } = req.body;

  if (
    !meetingId ||
    !role ||
    !testimonialText ||
    rating === undefined ||
    !feedbackText ||
    !testimonialGiverPublicProfile
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const {
    date,
    interviewerName,
    intervieweeName,
    interviewTitle,
    interviewTechStacks,
    interviewBookingLink,
  } = interviewDetails;

  if (
    !date ||
    !interviewerName ||
    !intervieweeName ||
    !interviewTitle ||
    !interviewTechStacks ||
    !interviewBookingLink
  ) {
    return res
      .status(400)
      .json({ error: "Missing required fields in interview details. " });
  }

  if (role !== "interviewer" && role !== "interviewee") {
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    if (role === "interviewer") {
      let userBooking = await Booking.findOne(
        { intervieweeBookings: { $elemMatch: { meetingId: meetingId } } },
        { "intervieweeBookings.$": 1 }
      );

      if (!userBooking) {
        return res.status(400).json({ error: "Booking not found" });
      }

      const findUserBooking = await Booking.findOne({ _id: userBooking.id });
      if (!findUserBooking) {
        return res.status(400).json({ error: "Booking not found" });
      }

      const findParticularUserBooking =
        findUserBooking.intervieweeBookings.filter(
          (item) => item.meetingId === meetingId
        );
      if (!findParticularUserBooking) {
        return res.status(400).json({ error: "Booking not found" });
      }

      if (findParticularUserBooking[0].status !== "past") {
        return res.status(400).json({ error: "Booking is not in past state" });
      }

      findParticularUserBooking[0].ratingReceived = rating;
      findParticularUserBooking[0].testimonialReceived = testimonialText;
      findParticularUserBooking[0].feedbackReceived = feedbackText;
      findParticularUserBooking[0].status = "approved";

      await findUserBooking.save();

      let user2Booking = await Booking.findOne(
        { interviewerBookings: { $elemMatch: { meetingId: meetingId } } },
        { "interviewerBookings.$": 1 }
      );

      if (!user2Booking) {
        return res.status(400).json({ error: "Booking not found" });
      }

      const findUser2Booking = await Booking.findOne({ _id: user2Booking.id });
      if (!findUser2Booking) {
        return res.status(400).json({ error: "Booking not found" });
      }

      const findParticularUser2Booking =
        findUser2Booking.interviewerBookings.filter(
          (item) => item.meetingId === meetingId
        );
      if (!findParticularUser2Booking) {
        return res.status(400).json({ error: "Booking not found" });
      }

      findParticularUser2Booking[0].hasApproved = true;

      await findUser2Booking.save();

      const emailContent = prepareApproveBookingEmailContent(
        findParticularUser2Booking[0].participantInformation.interviewer.name,
        findParticularUser2Booking[0].participantInformation.interviewer.email,
        findParticularUserBooking[0].participantInformation.interviewee.name,
        findParticularUserBooking[0].participantInformation.interviewee.email,
        findParticularUser2Booking[0].date,
        findParticularUser2Booking[0].startTime,
        findParticularUser2Booking[0].endTime,
        findParticularUser2Booking[0].locationURL,
        testimonialText,
        rating,
        feedbackText
      );

      await mailSender(
        [
          findParticularUser2Booking[0].participantInformation.interviewer
            .email,
          findParticularUserBooking[0].participantInformation.interviewee.email,
        ],
        "Interview Approved!",
        emailContent
      );

      let testimonialId = Math.random().toString(36).substring(7);

      let newTestimonial = {
        rating,
        testimonialText,
        testimonialGiverName:
          findParticularUser2Booking[0].participantInformation.interviewer.name,
        testimonialGiverPublicProfile,
        date: moment().format("Do MMM, YYYY"),
        testimonialId,
        interviewDetails,
      };

      // testimonial receiver

      const findTestimonial = await Testimonial.findOne({
        userId: findUserBooking.userId.toString(),
      });
      if (!findTestimonial) {
        const testimonial = new Testimonial({ userId: findUserBooking.userId });
        testimonial.intervieweeTestimonials.push(newTestimonial);
        await testimonial.save();
      } else {
        findTestimonial.intervieweeTestimonials.push(newTestimonial);
        await findTestimonial.save();
      }

      // testimonial giver

      let newTestimonialGiverSchema = {
        rating,
        testimonialText,
        feedbackText,
        date: moment().format("Do MMM, YYYY"),
        testimonialReceiverUserId: findUserBooking.userId.toString(),
        testimonialId,
      };

      const findTestimonialGiver = await Testimonial.findOne({
        userId: findUser2Booking.userId.toString(),
      });
      if (!findTestimonialGiver) {
        const testimonialGiver = new Testimonial({
          userId: findUser2Booking.userId,
        });
        testimonialGiver.myGivenTestimonials.push(newTestimonialGiverSchema);
        await testimonialGiver.save();
      } else {
        findTestimonialGiver.myGivenTestimonials.push(
          newTestimonialGiverSchema
        );
        await findTestimonialGiver.save();
      }

      return res.status(200).json({ message: "Booking approved successfully" });
    } else {
      let userBooking = await Booking.findOne(
        { interviewerBookings: { $elemMatch: { meetingId: meetingId } } },
        { "interviewerBookings.$": 1 }
      );

      if (!userBooking) {
        return res.status(400).json({ error: "Booking not found" });
      }

      const findUserBooking = await Booking.findOne({ _id: userBooking.id });
      if (!findUserBooking) {
        return res.status(400).json({ error: "Booking not found" });
      }

      const findParticularUserBooking =
        findUserBooking.interviewerBookings.filter(
          (item) => item.meetingId === meetingId
        );

      if (!findParticularUserBooking) {
        return res.status(400).json({ error: "Booking not found" });
      }

      if (findParticularUserBooking[0].status !== "past") {
        return res.status(400).json({ error: "Booking is not in past state" });
      }

      findParticularUserBooking[0].ratingReceived = rating;
      findParticularUserBooking[0].testimonialReceived = testimonialText;
      findParticularUserBooking[0].feedbackReceived = feedbackText;
      findParticularUserBooking[0].status = "approved";

      await findUserBooking.save();

      let user2Booking = await Booking.findOne(
        { intervieweeBookings: { $elemMatch: { meetingId: meetingId } } },
        { "intervieweeBookings.$": 1 }
      );

      if (!user2Booking) {
        return res.status(400).json({ error: "Booking not found" });
      }

      const findUser2Booking = await Booking.findOne({ _id: user2Booking.id });
      if (!findUser2Booking) {
        return res.status(400).json({ error: "Booking not found" });
      }

      const findParticularUser2Booking =
        findUser2Booking.intervieweeBookings.filter(
          (item) => item.meetingId === meetingId
        );

      if (!findParticularUser2Booking) {
        return res.status(400).json({ error: "Booking not found" });
      }

      findParticularUser2Booking[0].hasApproved = true;

      await findUser2Booking.save();

      const emailContent = prepareApproveBookingEmailContent(
        findParticularUser2Booking[0].participantInformation.interviewee.name,
        findParticularUser2Booking[0].participantInformation.interviewee.email,
        findParticularUserBooking[0].participantInformation.interviewer.name,
        findParticularUserBooking[0].participantInformation.interviewer.email,
        findParticularUser2Booking[0].date,
        findParticularUser2Booking[0].startTime,
        findParticularUser2Booking[0].endTime,
        findParticularUser2Booking[0].locationURL,
        testimonialText,
        rating,
        feedbackText
      );

      await mailSender(
        [
          findParticularUser2Booking[0].participantInformation.interviewee
            .email,
          findParticularUserBooking[0].participantInformation.interviewer.email,
        ],
        "Interview Approved!",
        emailContent
      );

      let testimonialId = Math.random().toString(36).substring(7);

      let newTestimonial = {
        rating,
        testimonialText,
        testimonialGiverName:
          findParticularUser2Booking[0].participantInformation.interviewee.name,
        testimonialGiverPublicProfile,
        date: moment().format("Do MMM, YYYY"),
        testimonialId,
        interviewDetails,
      };

      // testimonial receiver

      const findTestimonial = await Testimonial.findOne({
        userId: findUserBooking.userId.toString(),
      });
      if (!findTestimonial) {
        const testimonial = new Testimonial({ userId: findUserBooking.userId });
        testimonial.interviewerTestimonials.push(newTestimonial);
        await testimonial.save();
      } else {
        findTestimonial.interviewerTestimonials.push(newTestimonial);
        await findTestimonial.save();
      }

      // testimonial giver

      let newTestimonialGiverSchema = {
        rating,
        testimonialText,
        feedbackText,
        date: moment().format("Do MMM, YYYY"),
        testimonialReceiverUserId: findUserBooking.userId.toString(),
        testimonialId,
      };

      const findTestimonialGiver = await Testimonial.findOne({
        userId: findUser2Booking.userId.toString(),
      });
      if (!findTestimonialGiver) {
        const testimonialGiver = new Testimonial({
          userId: findUser2Booking.userId,
        });
        testimonialGiver.myGivenTestimonials.push(newTestimonialGiverSchema);
        await testimonialGiver.save();
      } else {
        findTestimonialGiver.myGivenTestimonials.push(
          newTestimonialGiverSchema
        );
        await findTestimonialGiver.save();
      }

      return res.status(200).json({ message: "Booking approved successfully" });
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
          "An error occurred while approving the booking"
        )
      );
  }
});

export { addNewBooking, approveBooking, changeBookingStatus, getAllBookings };
