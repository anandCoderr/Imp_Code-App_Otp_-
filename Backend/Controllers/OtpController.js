import {
  errorHelper,
  validatorHelper,
  successHelper,
  nodeMailerOtpHelper,
} from "../Helper/globalHelper.js";

import UserModel from "../Module/UserModule.js";

import OtpModel from "../Module/OtpModel.js";

const sendOtpController = async (req, res) => {
  const { email } = req.body;

  const rules = {
    email: `required|email`,
  };

  try {
    const validate = validatorHelper(req.body, rules);

    if (!validate) {
      return errorHelper(res, {
        message: "Email field is required",
        status: 400,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    const transportInstance = nodeMailerOtpHelper(
      email,
      "Email Verification Otp",
      `Your email verification Opt is:- ${otp}`
    );

    if (!transportInstance) {
      return errorHelper(res, { message: "Error sending OTP", status: 500 });
    }

    // ------checking user is already available or not and if yes then update otp with new one

    const findUserInstance = await OtpModel.findOneAndUpdate(
      { email },
      { $set: { otp } },
      { new: true }
    );

    console.log(`your otp is:-`, otp);

    if (!findUserInstance) {

      
      const emailOtpModelInstance = new OtpModel({
        email,
        otp,
      });

    

      await emailOtpModelInstance.save();

      return successHelper(res, "OTP sent successfully", 200);
    }

    return successHelper(res, "OTP sent successfully", 200);
  } catch (err) {
    console.log("err", err);
    return errorHelper(res, { message: "Error sending OTP", status: 500 });
  }
};

// -----------send otp from login


const sendOtpForLoginController = async (req, res) => {
  const { email } = req.body;

  const rules = {
    email: `required|email`,
  };

  try {
    const validate = validatorHelper(req.body, rules);

    if (!validate) {
      return errorHelper(res, {
        message: "Email field is required",
        status: 400,
      });
    }


    const userEmail=await UserModel.findOne({email});

    if(!userEmail){
        return errorHelper(res, { message: "User not registered", status: 401 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    const transportInstance = nodeMailerOtpHelper(
      email,
      "Email Verification Otp",
      `Your email verification Opt is:- ${otp}`
    );

    if (!transportInstance) {
      return errorHelper(res, { message: "Error sending OTP", status: 500 });
    }

    // ------checking user is already available or not and if yes then update otp with new one

    const findUserInstance = await OtpModel.findOneAndUpdate(
      { email },
      { $set: { otp } },
      { new: true }
    );

    console.log(`your otp is:-`, otp);

    if (!findUserInstance) {

      
      const emailOtpModelInstance = new OtpModel({
        email,
        otp,
      });

    

      await emailOtpModelInstance.save();

      return successHelper(res, "OTP sent successfully", 200);
    }

    return successHelper(res, "OTP sent successfully", 200);
  } catch (err) {
    console.log("err", err);
    return errorHelper(res, { message: "Error sending OTP", status: 500 });
  }
};



const otpVerificationController = async (req, res) => {
  const { otp } = req.body;

  try {
    const rules = {
      otp: `required|string`,
    };

    const validate = validatorHelper(req.body, rules);

    if (!validate) {
      return errorHelper(res, {
        message: "Otp field is required",
        status: 400,
      });
    }

    const otpInstance = await OtpModel.findOneAndUpdate(
      { otp },
      { $set: { isVerified: true } },
      { new: true }
    );

    if (!otpInstance) {
      return errorHelper(res, { message: "Invalid OTP", status: 401 });
    }

    //-------------- getting user info by email id

    const findUserInfoInstance = await UserModel.findOne({
      email: otpInstance.email,
    });

    if (!findUserInfoInstance) {
      return successHelper(
        res,
        "Otp Verification successful but user is not registered",
        200,
        { email: otpInstance.email, isRegistered: false }
      );
    }

    return successHelper(
      res,
      "User is Registered and here is data ",
      200,
      findUserInfoInstance
    );
  } catch (err) {
    return errorHelper(res, err);
  }
};



export { sendOtpController, otpVerificationController,sendOtpForLoginController };
