import express from "express";
import { register,verifyLogin } from "../Controllers/AuthController.js";
import {sendOtpForLoginController} from '../Controllers/OtpController.js'


import {userPost,getUserPosts,likeAndDislike,getMyLikes,commentOnPost,showPostComments} from '../Controllers/userPostController.js'

import upload from '../Helper/imgUploadHelper.js'

// -----------middleware Function


import userAuthMiddleware from '../Middleware/userAuthMiddleware.js'

// ---------route starts

const router = express.Router();

router.post("/register", register);
router.post("/login", sendOtpForLoginController);
router.post("/login/verify", verifyLogin);






// --------------- user posts route

router.post('/post',userAuthMiddleware,upload.array('images', 12),userPost);
router.get('/get/posts',userAuthMiddleware,getUserPosts);
router.get('/get/posts?search',userAuthMiddleware,getUserPosts);

// --------------post like and dislike route
router.post('/post/like-dislike',userAuthMiddleware,likeAndDislike);

// ------------get post like

router.get('/get/myLikes',userAuthMiddleware,getMyLikes);


// -----------------comment section 

router.post('/post/comment',userAuthMiddleware,commentOnPost);

//------------ get all comments by post id

router.get('/get/comments/:postId',userAuthMiddleware,showPostComments);



export default router;