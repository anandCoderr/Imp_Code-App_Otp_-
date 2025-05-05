import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId
import PostModel from '../Module/PostModel.js'

import  { errorHelper, successHelper,validatorHelper} from '../Helper/globalHelper.js';

import LikeModel from '../Module/likeAndDislikeModel.js'

import commentModel from '../Module/commentsModel.js'


const userPost=async(req,res)=>{

    const loggedUserId=req.userId;
    
    try{

    const {title,description}=req.body;
    console.log(`Files Data ==`,req.files);
    

    const rules={
        title:'required|string',
        description:'required|string',
        
       
    }


        
        const inputValidatorInstance= validatorHelper(req.body,rules);

    if(!inputValidatorInstance)
    {
        return errorHelper(res,{message:"All Fields are required",status:400});
    }

   


    const user=new PostModel({userId:loggedUserId,title,description,images:req.files});

    const userPostSaveInstance=await user.save();

    if(!userPostSaveInstance)
    {
        return errorHelper(res,{message:"Failed to save User",status:500});
    }

    return successHelper(res,"User Created Successfully",200,userPostSaveInstance);

}
catch(err){
    return errorHelper(res,err);

}


}


// ---------- All posts

// const getUserPosts=async(req,res)=>{

//     const {search}=req.query;

//     try{
//    let condition = {}

//    if (search) {
//     condition = {
//         $or: [
//             { title: { $regex: search, $options: "i" } },       // Search in title
//             { description: { $regex: search, $options: "i" } }, // Search in description
//             { 'user.name': { $regex: search, $options: "i" } } // Search in description

//         ]
//     };
// }

//             const postsInstance=await PostModel.aggregate([
               
//                 {
//                     $lookup:{
//                         from:"users",
//                         localField:"userId",
//                         foreignField:"_id",
//                         as:"user"
//                     }
//                 },
//                 { $unwind : "$user" },
//                 {
//                     $match:condition
//                 },
               
               
//             ]);

//             if(!postsInstance)
//             {
//                 return errorHelper(res,{message:"No Posts Found",status:404});
//             }


            
//             return successHelper(res,"Posts fetched successfully",200,postsInstance);
            


//     }
//     catch(err){
//         return errorHelper(res,err);

//     }


// } 


const getUserPosts=async(req,res)=>{

    const {search}=req.query;
console.log(`user's id ${req.userId}`)
    try{
   let condition = {}

   if (search) {
    condition = {
        $or: [
            { title: { $regex: search, $options: "i" } },       // Search in title
            { description: { $regex: search, $options: "i" } }, // Search in description
            { 'user.name': { $regex: search, $options: "i" } } // Search in description

        ]
    };
}

            const postsInstance=await PostModel.aggregate([
               
                {
                    $lookup:{
                        from:"users",
                        localField:"userId",
                        foreignField:"_id",
                        as:"user"
                    }
                },
                {
                    $lookup: {
                      from: "likeanddislikes",
                      let: { fromPostModel: "$_id" }, // here this _id is the "_id" of "PostModel" model, here it automatically detects it.
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $and: [
                                { $eq: ["$postId", "$$fromPostModel"] },
                                { $eq: ["$userId", new ObjectId(req.userId)] }
                              ]
                            }
                          }
                        }
                      ],
                      as: "likedByUser"
                    }
                  },

                  {
                    $addFields: {
                      isLike: { $gt: [{ $size: "$likedByUser" }, 0] } // If user has liked, isLike = true
                    }
                  },
            


                { $unwind : "$user" },
                {
                    $match:condition
                },

                {
                    $project:{
                        _id:1,title:1,
                        description:1,
                        isLike:1,
                        user:1,

                    }
                }
               
               
            ]);

            if(!postsInstance)
            {
                return errorHelper(res,{message:"No Posts Found",status:404});
            }


            
            return successHelper(res,"Posts fetched successfully",200,postsInstance);
            


    }
    catch(err){
        return errorHelper(res,err);

    }


} 


// like a& dislike posts 


const likeAndDislike=async(req,res)=>{

    const loggedUserId=req.userId;

    const {postId}=req.body;

    const rules={
        postId:'required|string',
    }
    try{

        const validatorInstance=validatorHelper(req.body,rules);

        if(!validatorInstance){
            return errorHelper(res,{message:"All Fields are required",status:400});
        }

        const likeInstance=await LikeModel.findOne({$and:[{userId:loggedUserId},{postId:postId}]});

if(likeInstance)
{

   
    const delInstance=await LikeModel.findByIdAndDelete(likeInstance._id);

    if(!delInstance)
    {
        return errorHelper(res,{message:"Failed to delete liked post",status:500});
    }

    // -----------post dislike count
    const postDislikeInstance=await PostModel.findOneAndUpdate({ _id: postId },
        { $inc: { totalLike: -1 } }, // Increment totalLike by 1
        { new: true } // Return the updated document);
    );
    if(!postDislikeInstance)
        {
            return errorHelper(res,{message:"Failed to update post dislike count",status:500});
        }

    return successHelper(res,"Post Disliked Successfully",200);

}


        const likeSaveInstance=new LikeModel({userId:loggedUserId,postId:postId});

        const saveLikeInstance=await likeSaveInstance.save();

        if(!saveLikeInstance)
            {
                return errorHelper(res,{message:"Failed to save liked post",status:500});
            }

            const postLikeInstance = await PostModel.findOneAndUpdate(
                { _id: postId },
                { $inc: { totalLike: 1 } }, // Increment totalLike by 1
                { new: true } // Return the updated document
            );
            
            if(!postLikeInstance)
            {
                return errorHelper(res,{message:"Failed to update post like count",status:500});
            }
    

            return successHelper(res,"Post Liked Successfully",200);


    }
    catch(err){
        return errorHelper(res,err);

    }




}



// -----------------get my likes



const getMyLikes=async(req,res)=>{
    const loggedUserId=req.userId;

    try{


        const checkUserLoggedData =await LikeModel.find({userId:loggedUserId}).populate(["postId"]);



        return successHelper(res,"Liked posts",200,checkUserLoggedData);

    }
    catch(err){
        return errorHelper(res,err);

    }
}



// ---------------comment on post



const commentOnPost=async(req,res)=>{
    const loggedUser=req.userId;

    const {postId,comment}=req.body;
    
    const rules={
        postId:'required|string',
        comment:'required|string',
    }

    const commentsValidatorInstance=await validatorHelper(req.body,rules);

    if(!commentsValidatorInstance)
    {
        return errorHelper(res,{message:"All Fields are required",status:400});
    }

    const commentSaveInstance=new commentModel({userId:loggedUser,postId:postId,comment});

    const saveCommentInstance=await commentSaveInstance.save();

    if(!saveCommentInstance)
    {
        return errorHelper(res,{message:"Failed to save comment",status:500});
    }

    return successHelper(res,"Your comment has been saved",201,saveCommentInstance);


}




// ------------------- get post comments

const showPostComments=async(req,res)=>{
    const{postId}=req.params; 

    console.log(`post id :-----> ${postId}`);

    if(!postId)
    {
        return errorHelper(res,{message:"postId is required",status:400});
    }


    const commentInstance=await commentModel.find({postId}).populate('userId');


    return successHelper(res,"Comments on Post",200,commentInstance);

}


export {userPost,getUserPosts,likeAndDislike,getMyLikes,commentOnPost,showPostComments}



  