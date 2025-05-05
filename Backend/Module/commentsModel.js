import mongoose from 'mongoose';

const commentSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'userPost'
    },
    comment:{
        type:String,
        required: true,
    }
},{
    timestamps: true,
});


const commentModel=mongoose.model('comments',commentSchema);

export default commentModel;