import mongoose from 'mongoose';

const categorySchema=new mongoose.Schema({
    categories:{type:String,required:true,unique:true},
},{
    timestamps: true,
});

const CategoryModel=mongoose.model('productCategory',categorySchema);

export default CategoryModel