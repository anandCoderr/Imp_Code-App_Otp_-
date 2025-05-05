import express from 'express';
import userAuthMiddleware from '../Middleware/userAuthMiddleware.js';
import {doFollow,getFollow,userDetails} from '../Controllers/FollowAndFollowerController.js'


const route=express.Router();

route.post("/follow",userAuthMiddleware,doFollow);
route.get("/follow",userAuthMiddleware,getFollow);
route.get("/user/details",userAuthMiddleware,userDetails);


export default route;