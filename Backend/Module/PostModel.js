import mongoose from 'mongoose'

const userSchema=new mongoose.Schema({
    userId:{
      type:mongoose.Schema.Types.ObjectId, required:true, ref:"User"
    },
    title:{
        type:String,
        required:true,
        default:"Dummy Title"

    },
    description:{
        type:String,
        required:true,
        default:"Dummy Description"
    },
    images:{
        type:Array,
        required:true,
        default:['img1.jpg','img2.jpg']
    },
    totalLike:{
        type:Number,
        default:0
    }

},{
    timestamps:true,
    
})



const PostModel=mongoose.model('userPost',userSchema);


export default PostModel