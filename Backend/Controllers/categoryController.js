import CategoryModel from '../Module/productCategoryModel.js'


import { errorHelper, successHelper, validatorHelper } from '../Helper/globalHelper.js'

import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId





const addCategory=async(req,res)=>{


        const rules={
            category:'required|string'
        };




        const matched= validatorHelper(req.body,rules)

        if(!matched)
        {
           
            // return customErrorHandler(res,v.errors.category.message,422);
            
            return errorHelper(res,{message:"Needed Category Name and it must be Unique",status:422});
            
        }

        try{


            const checkingCategory=await CategoryModel.findOne({ categories: req.body.category })

            if(checkingCategory)
            {
                return errorHelper(res,{message:'Category already exists',status:409});
            }

            // ---adding category
            
        const newCategory = new CategoryModel({ categories: req.body.category });
        await newCategory.save();


        return successHelper(res,'Category added successfully',201,newCategory)
    }
    catch(err){
        return errorHelper(res,err);
    }


}


// -------------update Category



const updateCategory=async(req,res)=>{
    const categoryId= req.params.categoryId;

    const rules={
        category:'required|string'
    };



    const matched=validatorHelper(req.body,rules)


    if(!matched)
    {
       
        return errorHelper(res,{message:"Category must be String and It is required field",status:422});
        
    }

    try{

        console.log("categoryId",categoryId,"Req body ",req.body)

        const category=await CategoryModel.findByIdAndUpdate(new ObjectId(categoryId),{categories:req.body.category},{new:true});

        if(!category)
        {
            return errorHelper(res,{message:"Category Not Found",status:404});
        }

        return successHelper(res,'Category updated successfully',200,category)
    }
    catch(err){
        return errorHelper(res,err);
    }

}


// ------------- delete category 

const deleteCategory=async(req,res)=>{


    const categoryId=req.params.categoryId;

    try{

        const category=await CategoryModel.findByIdAndDelete(new ObjectId(categoryId));

        if(!category)
        {
            return errorHelper(res,{message:"Category Not Found",status:404});
        }

        return successHelper(res,'Category deleted successfully',200)
    }
    catch(err){
        return errorHelper(res,err);
    }

}


// -------------get all categories

const getAllCategories=async(req,res)=>{

    try{

        const categories=await CategoryModel.find({});

        return successHelper(res,'All Categories',200,categories)
    }
    catch(err){
        return errorHelper(res,err);
    }

}

export  {addCategory,deleteCategory,updateCategory,getAllCategories}