import {
  userAccountActivatedNotificationTemplate,
  userActivationUrlEmailTemplate,
  userResetPasswordLinkEmailTemplate,
} from "./emailTemplate.js";
import { emailTransporter } from "./transport.js";

//THis is for activating the user
export const userActivationUrlEmail = async (obj) => {
  const transport = emailTransporter();
  const info = await transport.sendMail(userActivationUrlEmailTemplate(obj));
  console.log("🔔 Email info:", info);
  return info.messageId; // This is the message ID of the sent email
};

//THis is for activating the user
export const userActivatedNotificationEmail = async (obj) => {
  const transport = emailTransporter();
  const info = await transport.sendMail(
    userAccountActivatedNotificationTemplate(obj)
  );
  return info.messageId;
};
//This is for resetting the user password
export const userResetPasswordEmail = async (obj) => {
  const transport = emailTransporter();
  const info = transport.sendMail(userResetPasswordLinkEmailTemplate(obj));
  return info.messageId;
};
