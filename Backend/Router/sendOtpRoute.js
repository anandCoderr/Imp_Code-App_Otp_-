import express from 'express';
import { sendOtpController,otpVerificationController } from '../Controllers/OtpController.js';

const router=express.Router();


router.post('/send',sendOtpController);
router.post('/verify',otpVerificationController);

export default router;