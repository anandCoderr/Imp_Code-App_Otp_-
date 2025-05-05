import express from "express";
import "dotenv/config";
import dbConnectFunction from "./Config/DbConfig.js";
import registerRoute from "./Router/AuthRoute.js";
import sendOtpRoute from "./Router/sendOtpRoute.js";
import productAndCatRoute from "./Router/productAndCatRoute.js";
import eventRoute from './Router/eventRoute.js'
import  bodyParser from 'body-parser';
import followAndFollowerRouter from './Router/followAndFollowerRouter.js'
import awsRouter from './Router/awsRouter.js'

import  cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors())

app.use(bodyParser.urlencoded({ extended:true}));

// --------db connect
dbConnectFunction();

// ---------register route
app.use("/user", registerRoute);

// ------------send otp route

app.use('/otp',sendOtpRoute);

// --------- PRODUCT AND cATEGORY ROUTES


app.use('/product', productAndCatRoute);


// -----------------event router related

app.use('/event',eventRoute);



// -----------------follow and follower router related

app.use('/social',followAndFollowerRouter);



// -----------------aws router related

app.use('/aws',awsRouter);


const port = process.env.PORT_NUM || 9000;

app.listen(port, () => {
  console.log(` server is running on port number ${port}`);
});