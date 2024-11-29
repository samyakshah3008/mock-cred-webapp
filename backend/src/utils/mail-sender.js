import { transporter } from "../constants/node-mailer.js";

const mailSender = async (receiverEmail, subject, body) => {
  try {
    let sentEmail = await transporter.sendMail({
      from: "process.env.NODEMAILER_APPLICATION_SPECIFIC_EMAIL",
      to: receiverEmail,
      subject: subject,
      html: body,
    });
    return sentEmail;
  } catch (err) {
    console.error(err);
  }
};

export default mailSender;
