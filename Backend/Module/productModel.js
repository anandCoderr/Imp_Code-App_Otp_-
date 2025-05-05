import mongoose from 'mongoose';

const productSchema=new mongoose.Schema({
    title:{type:String, required:true,default:"Dummy Default Title"},
    description:{type:String, required:true,default:"This is Description" },
    images:{type:Array, required:true, default:["Tiger.png"]},
    size:{type:String, default:'Xl', required:true},
    category:{type:mongoose.Schema.Types.ObjectId, required:true, ref:"productCategory"},
    userId:{type:mongoose.Schema.Types.ObjectId, required:true, ref:"user"},
    price:{type:Number, required:true},
    isStatus:{type:Boolean, default:true},
},{
    timestamps:true,
});

const productModel=mongoose.model('product',productSchema);
export default productModel