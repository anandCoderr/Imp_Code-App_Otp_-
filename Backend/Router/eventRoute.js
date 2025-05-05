import {setEvent,updateEvent,deleteEvent,getEvents} from '../Controllers/eventController.js'
import express from 'express';
import userAuthMiddleware from '../Middleware/userAuthMiddleware.js'
import upload from '../Helper/imgUploadHelper.js'


const router=express.Router();

router.post('/set',userAuthMiddleware,upload.array('image'),setEvent);
router.put('/update/:eventId',userAuthMiddleware,upload.array('image'),updateEvent);
router.delete('/delete/:eventId',userAuthMiddleware,deleteEvent);
router.get('/get',userAuthMiddleware,getEvents);


export default router;