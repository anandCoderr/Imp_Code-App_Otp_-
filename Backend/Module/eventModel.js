
import mongoose from 'mongoose';


const eventSchema=new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true,
    },
    // image:{
    //     type:Array,
    //     required: true,
    //     default:['img1.jpg','img2.jpg']
    // },
    image:[{
     name:{
        type:String
     }
    }],
    category:{
        type:String,
        enum:["Cricket","Football","Basketball"],
    },
    status:{
        type:String,
        enum:["ongoing","expired"]
    },
    startDate:{
        type:Date,
        required: true
    },
    endDate:{
        type:Date,
        required: true
    }
},{
    timestamps: true,
});


const eventModel=mongoose.model('event',eventSchema);

export default eventModel;












// import mongoose from 'mongoose';


// const eventSchema=new mongoose.Schema({
//     title:{
//         type:String,
//         required: true
//     },
//     description:{
//         type:String,
//         required: true,
//     },
//      image:{
//          type:Array,
//          required: true,
//          default:['img1.jpg','img2.jpg']
//     },
//     category:{
//         type:String,
//         enum:["Cricket","Football","Basketball"],
//     },
//     status:{
//         type:String,
//         enum:["ongoing","expired"]
//     },
//     startDate:{
//         type:Date,
//         required: true
//     },
//     endDate:{
//         type:Date,
//         required: true
//     }
// },{
//     timestamps: true,
// });


// const eventModel=mongoose.model('event',eventSchema);

// export default eventModel;


