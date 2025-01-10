import moment from "moment";
import { Booking } from "../models/booking.model.js";
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
    name,
    email,
    date,
    startTime,
    endTime,
    status,
    locationURL,
    interviewerUsername,
    additionalInfo,
    duration,
  } = bookingData;

  if (
    !name ||
    !email ||
    !date ||
    !startTime ||
    !endTime ||
    !interviewerUsername ||
    !duration ||
    !locationURL
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newMeeting = {
      name,
      email,
      date,
      startTime,
      endTime,
      status: status || "unconfirmed",
      locationURL: locationURL || null,
      additionalInfo: additionalInfo || null,
    };

    const findInterviewer = await User.findOne({
      "onboardingDetails.stepOne.username": interviewerUsername,
    });

    if (!findInterviewer) {
      return res.status(400).json({ error: "Interviewer not found" });
    }

    let interviewerBooking = await Booking.findOne({
      userId: findInterviewer.id,
    });
    if (!interviewerBooking) {
      interviewerBooking = new Booking({ userId: findInterviewer.id });
    }

    interviewerBooking.interviewerBookings.push(newMeeting);
    await interviewerBooking.save();

    let intervieweeBooking = await Booking.findOne({ userId: user._id });
    if (!intervieweeBooking) {
      intervieweeBooking = new Booking({ userId: user._id });
    }

    intervieweeBooking.intervieweeBookings.push(newMeeting);
    await intervieweeBooking.save();

    // Send Email Invitations
    const emailContent = `
      <h2>New Interview Scheduled</h2>
      <p><strong>What:</strong> ${duration} Min Meeting between ${
      user.firstName
    } ${user.lastName} and ${findInterviewer.firstName} ${
      findInterviewer.lastName
    }</p>
      <p><strong>When:</strong> ${new Date(
        date
      ).toDateString()} | ${startTime} - ${endTime} (Asia/Calcutta)</p>
      <p><strong>Who:</strong></p>
      <ul>
        <li>${findInterviewer.firstName} ${
      findInterviewer.lastName
    } - Organizer ${findInterviewer.email} </li>
        <li>${user.firstName} ${user.lastName} - Guest ${user.email}</li>
      </ul>
      <p><strong>Where:</strong> Google Meet</p>
      <p>Meeting URL: <a href="${locationURL}">${locationURL}</a></p>
    `;

    await mailSender(
      [user.email, findInterviewer.email],
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

const cancelBooking = asyncHandler(async (req, res) => {
  const { cancelBookingPayload } = req.body;
  const user = req?.user;

  const { bookingId, isInterviewer } = cancelBookingPayload;

  if (!bookingId || isInterviewer === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let userBooking = await Booking.findOne({ userId: user._id });
    if (!userBooking) {
      return res.status(400).json({ error: "Booking not found" });
    }

    let bookings = isInterviewer
      ? userBooking.interviewerBookings
      : userBooking.intervieweeBookings;
    const findBooking = bookings.find(
      (booking) => booking._id.toString() === bookingId
    );
    if (!findBooking) {
      return res.status(400).json({ error: "Booking not found" });
    }

    findBooking.status = "canceled";

    await userBooking.save();

    return res.status(200).json({ message: "Booking canceled successfully" });
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
          "An error occurred while canceling the booking"
        )
      );
  }
});

const rescheduleBooking = asyncHandler(async (req, res) => {
  const { bookingData } = req.body;
  const user = req?.user;
  const {
    name,
    email,
    date,
    startTime,
    endTime,
    status,
    locationURL,
    interviewerUsername,
    additionalInfo,
    duration,
  } = bookingData;

  if (
    !name ||
    !email ||
    !date ||
    !startTime ||
    !endTime ||
    !interviewerUsername ||
    !duration ||
    !locationURL
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newMeeting = {
      name,
      email,
      date,
      startTime,
      endTime,
      status: status || "unconfirmed",
      locationURL: locationURL || null,
      additionalInfo: additionalInfo || null,
    };

    const findInterviewer = await User.findOne({
      "onboardingDetails.stepOne.username": interviewerUsername,
    });

    if (!findInterviewer) {
      return res.status(400).json({ error: "Interviewer not found" });
    }

    let interviewerBooking = await Booking.findOne({
      userId: findInterviewer.id,
    });
    if (!interviewerBooking) {
      interviewerBooking = new Booking({ userId: findInterviewer.id });
    }

    interviewerBooking.interviewerBookings.push(newMeeting);
    await interviewerBooking.save();

    let intervieweeBooking = await Booking.findOne({ userId: user._id });
    if (!intervieweeBooking) {
      intervieweeBooking = new Booking({ userId: user._id });
    }

    intervieweeBooking.intervieweeBookings.push(newMeeting);
    await intervieweeBooking.save();

    // Send Email Invitations
    const emailContent = `
      <h2>New Interview Scheduled</h2>
      <p><strong>What:</strong> ${duration} Min Meeting between ${
      user.firstName
    } ${user.lastName} and ${findInterviewer.firstName} ${
      findInterviewer.lastName
    }</p>
      <p><strong>When:</strong> ${new Date(
        date
      ).toDateString()} | ${startTime} - ${endTime} (Asia/Calcutta)</p>
      <p><strong>Who:</strong></p>
      <ul>
        <li>${findInterviewer.firstName} ${
      findInterviewer.lastName
    } - Organizer ${findInterviewer.email} </li>
        <li>${user.firstName} ${user.lastName} - Guest ${user.email}</li>
      </ul>
      <p><strong>Where:</strong> Google Meet</p>
      <p>Meeting URL: <a href="${locationURL}">${locationURL}</a></p>
    `;

    await mailSender(
      [user.email, findInterviewer.email],
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

export { addNewBooking, cancelBooking, getAllBookings, rescheduleBooking };
