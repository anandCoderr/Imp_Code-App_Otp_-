import mongoose from "mongoose";

const dbConnectFunction = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("Data base is already connect");
    return;
  }

  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/otpVerification");

    console.log("Data base is connected");
  } catch (err) {
    console.log("Error in connecting to database", err.message || err);
    process.exit(1);
  }
};

mongoose.connection.on("connected", () => {
  console.log("Database connected");
});

mongoose.connection.on("disconnected", () => {
  console.log("Database disconnected");
});

export default dbConnectFunction;


// -----------------------------------


