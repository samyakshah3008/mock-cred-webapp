export const getStatusText = (status) => {
  if (status == "upcoming") {
    return "Upcoming";
  } else if (status == "unconfirmed") {
    return "Unconfirmed";
  } else if (status == "approved") {
    return "Approved";
  } else if (status == "canceled") {
    return "Canceled";
  } else if (status == "past") {
    return "Past";
  }
};

export const prepareCancelBookingEmailContent = (
  name,
  email,
  user2Name,
  user2Email,
  date,
  startTime,
  endTime,
  locationURL,
  reason
) => {
  return `
  <h2>Interview Cancelled</h2>
  <p>We regret to inform you that the scheduled interview has been cancelled by ${name} </p>
  <div> Reason for cancellation: ${reason || "No reason specified."} </div>
  <p><strong>Details of the cancelled meeting:</strong></p>
  <p><strong>What:</strong> Meeting between ${name} and ${user2Name}
  </p>
  <p><strong>When:</strong> ${new Date(
    date
  ).toDateString()} | ${startTime} - ${endTime} (Asia/Calcutta)</p>
  <p><strong>Who:</strong></p>
  <ul>
    <li>${name} - ${email} </li>
    <li> ${user2Name} - ${user2Email}</li>
  </ul>
  <p><strong>Where:</strong> Google Meet</p>
  <p>Meeting URL: <a href="${locationURL}">${locationURL}</a></p>
  <p>If you have any questions or need further assistance, please contact at - ${user2Email} </p>
`;
};

export const prepareUnconfirmedBookingEmailContent = (
  name,
  email,
  user2Name,
  user2Email,
  date,
  startTime,
  endTime,
  locationURL,
  reason
) => {
  return `
    <h2>Interview Moved to Unconfirmed!</h2>
    <p>Hang on tight! Interview has been moved to Unconfirmed for time being by ${name} </p>
    <div> Reason for unconfirmation: ${reason || "No reason specified."} </div>
    <p><strong>Details of the unconfirmed meeting:</strong></p>
    <p><strong>What:</strong> Meeting between ${name} and ${user2Name}
    </p>
    <p><strong>When:</strong> ${new Date(
      date
    ).toDateString()} | ${startTime} - ${endTime} (Asia/Calcutta)</p>
    <p><strong>Who:</strong></p>
    <ul>
      <li>${name} - ${email} </li>
      <li> ${user2Name} - ${user2Email}</li>
    </ul>
    <p><strong>Where:</strong> Google Meet</p>
    <p>Meeting URL: <a href="${locationURL}">${locationURL}</a></p>
    <p>If you have any questions or need further assistance, please contact at - ${user2Email} </p>
  `;
};

export const prepareUpcomingBookingEmailContent = (
  name,
  email,
  user2Name,
  user2Email,
  date,
  startTime,
  endTime,
  locationURL,
  reason
) => {
  return `
    <h2>Are you ready? </h2>
    <p>Interview has been confirmed by ${name} </p>
    <p><strong>Details of the upcoming interview:</strong></p>
    <p><strong>What:</strong> Meeting between ${name} and ${user2Name}
    </p>
    <p><strong>When:</strong> ${new Date(
      date
    ).toDateString()} | ${startTime} - ${endTime} (Asia/Calcutta)</p>
    <p><strong>Who:</strong></p>
    <ul>
      <li>${name} - ${email} </li>
      <li> ${user2Name} - ${user2Email}</li>
    </ul>
    <p><strong>Where:</strong> Google Meet</p>
    <p>Meeting URL: <a href="${locationURL}">${locationURL}</a></p>
    <p>If you have any questions or need further assistance, please contact at - ${user2Email} </p>
  `;
};

export const prepareRescheduleBookingEmailContent = (
  name,
  email,
  user2Name,
  user2Email,
  date,
  startTime,
  endTime,
  locationURL,
  reason,
  bookingLink
) => {
  return `
      <h2>Interview Reschedule Request </h2>
      <p>This interview has been cancelled by ${name} and requesting you to please pick a different time slot from - <a target="_blank" href="${
    process.env.FRONTEND_BASE_URL
  }${bookingLink}">${
    process.env.FRONTEND_BASE_URL
  }${bookingLink}</a>  to reschedule. </p>
    <div> Reason for rescheduling: ${reason || "No reason specified."} </div>
      <p><strong>Details of the cancelled interview:</strong></p>
      <p><strong>What:</strong> Meeting between ${name} and ${user2Name}
      </p>
      <p><strong>When:</strong> ${new Date(
        date
      ).toDateString()} | ${startTime} - ${endTime} (Asia/Calcutta)</p>
      <p><strong>Who:</strong></p>
      <ul>
        <li>${name} - ${email} </li>
        <li> ${user2Name} - ${user2Email}</li>
      </ul>
      <p><strong>Where:</strong> Google Meet</p>
      <p>Meeting URL: <a href="${locationURL}">${locationURL}</a></p>
      <p>If you have any questions or need further assistance, please contact at - ${user2Email} </p>
    `;
};

export const prepareApproveBookingEmailContent = (
  name,
  email,
  user2Name,
  user2Email,
  date,
  startTime,
  endTime,
  locationURL,
  testimonialText,
  rating,
  feedbackText
) => {
  return `
    <h2>Interview Approved!</h2>
    <p>Interview has been approved by ${name} 😻 </p>
    <div>Testimonial - ${testimonialText} </div>
    <div>Rating - ${rating} </div>
    <div>Feedback - ${feedbackText} </div>
    <div>You can find more details on <a target="_blank" href="${
      process.env.FRONTEND_BASE_URL
    }${`/dashboard/testimonials`}">${
    process.env.FRONTEND_BASE_URL
  }${`/dashboard/testimonials`}</a> </div>

   <p><strong>Details of the approved interview:</strong></p>
      <p><strong>What:</strong> Meeting between ${name} and ${user2Name}
      </p>
      <p><strong>When:</strong> ${new Date(
        date
      ).toDateString()} | ${startTime} - ${endTime} (Asia/Calcutta)</p>
      <p><strong>Who:</strong></p>
      <ul>
        <li>${name} - ${email} </li>
        <li> ${user2Name} - ${user2Email}</li>
      </ul>
     
    `;
};
