import UserModel from "../Module/UserModule.js";

import jwt from 'jsonwebtoken';


import {
  errorHelper,
  validatorHelper,
  successHelper,
} from "../Helper/globalHelper.js";
import OtpModel from "../Module/OtpModel.js";


// -----------------register


const register = async (req, res) => {
  const { name, email, profile, number } = req.body;

  const rules = {
    name: `string`,
    email: `required|email`,
    profile: `string`,
    number: `required|string`,
  };

  try {
    const validate = await validatorHelper(req.body, rules);

    if (!validate) {
      return errorHelper(res, {
        message: "All fields are required",
        status: 400,
      });
    }



    // ---checking user is available or not

    const [emailCheck, numberCheck] = await Promise.all([
      UserModel.findOne({ email }),
      UserModel.findOne({ number }),
    ]);

    if (emailCheck || numberCheck) {
      return errorHelper(res, { message: "User already exist, Email and Number must be unique", status: 409 });
    }

    // ---creating new user

    const newUser = new UserModel({
      name,
      email,
      profile,
      number,
    });

    const saveUser = await newUser.save();

    if (!saveUser) {
      return errorHelper(res, { message: "User not saved", status: 400 });
    }

    var token = jwt.sign({ userId: saveUser._id }, process.env.SECREAT_KEY);



    return successHelper(res, "User registered successfully", 200, {data:saveUser,jwtToken:token});



 
  } catch (err) {
    return errorHelper(res, err);
  }
};




// -------------login verify

const verifyLogin=async(req,res)=>{

  
  const { otp } = req.body;

  try{

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


      const otpInstance=await OtpModel.findOneAndUpdate({otp},{$set:{isVerified:true}},{ new: true })

      if(!otpInstance){
          return errorHelper(res, { message: "Invalid OTP", status: 401 });
      }


      

      //-------------- getting user info by email id

      const findUserInfoInstance=await UserModel.findOne({email:otpInstance.email})

      if(!findUserInfoInstance){
          return errorHelper(res,  {message:"user is not registered",status: 200} );
      }

      const token = jwt.sign({ userId: findUserInfoInstance._id }, process.env.SECREAT_KEY);



      return successHelper(res,'User is Registered and here is data ',200,{data:findUserInfoInstance,jwtToken:token})


  }
  catch(err){
      return errorHelper(res, err);
  }


}




export { register,verifyLogin };