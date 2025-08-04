import nodemailer from "nodemailer";

export const emailTransporter = () => {
  // Create a transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    secure: false,
  });
  return transporter;
};
