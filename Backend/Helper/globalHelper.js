import { Validator } from "node-input-validator";
import nodemailer from "nodemailer";

const errorHelper = (res, err) => {
  const errMessage = err.message || "Server Error";
  const errStatusCode = err.statusCode || err.status || 500;

  console.log(`Error stack:- ${err.stack}`);

  return res.status(errStatusCode).json({
    message: errMessage,
    status: errStatusCode,
  });
};

const successHelper = (res, message, status, data = {}) => {
  return res.status(status || 200).json({
    message: message || "Success",
    status: status || 200,
    data: data,
  });
};

const validatorHelper = async (body, validCheck) => {
  const v = new Validator(body, validCheck);

  return await v.check();
};

// ----nodemailer otp verification code

const nodeMailerOtpHelper = async (to, sub, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: to,
      subject: sub,
      text: message,
    });

    console.log("Email sent: ", info.messageId);

    return info;
  } catch (err) {
    console.log("Error sending email", err.message || err);
    return null;
  }
};


const newValidatorHelper = async (body, validCheck) => {
  const v = new Validator(body, validCheck);
  const isValid = await v.check();

  if (!isValid) {
    return { success: false, errors: v.errors }; // Return error messages
  }

  return { success: true }; // Validation passed
};


export { errorHelper, successHelper, validatorHelper, nodeMailerOtpHelper,newValidatorHelper };
