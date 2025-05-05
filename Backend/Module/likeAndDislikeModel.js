import mongoose from 'mongoose';


const likeSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'userPost'
    }
},{
    timestamps: true,

});

const LikeModel=mongoose.model('LikeAndDislike',likeSchema);

export default LikeModel;
