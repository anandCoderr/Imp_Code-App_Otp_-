import mongoose from "mongoose";

const excelSchema=new mongoose.Schema({
    Title:{
        type:String,
    },
    Description:{
        type:String,
    },
    Images:{
        type:String,
    },
    Category:{
        type:String
    }

});

const excelModel=mongoose.model('excelCategory',excelSchema);

export default excelModel;