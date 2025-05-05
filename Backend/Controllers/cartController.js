import CartModel from "../Module/cartModel.js";
import createOrderModel from '../Module/orderModel.js'
import {
  errorHelper,
  successHelper,
  validatorHelper,
} from "../Helper/globalHelper.js";

import mongoose from "mongoose";


const addToCart = async (req, res) => {
  const loggedInUser = req.userId;

  const { productId } = req.body;

  const rules = {
    productId: "required|string",
  };

  const validate = validatorHelper(req.body, rules);

  if (!validate) {
    return errorHelper(res, {
      message: "productId field is required",
      status: 400,
    });
  }

  try {
    const availableCartInstance = await CartModel.findOne({ productId });

    if (availableCartInstance) {
      availableCartInstance.quantity += 1;
      await availableCartInstance.save();

      return successHelper(
        res,
        "Product added to cart successfully",
        200,
        availableCartInstance
      );
    }

    const newCartInstance = new CartModel({
      userId: loggedInUser,
      productId,
    });

    await newCartInstance.save();
    return successHelper(
      res,
      "Product added to cart successfully",
      200,
      newCartInstance
    );
  } catch (err) {
    return errorHelper(res, err);
  }
};


const getCartData=async(req,res)=>{

    const loggedInUser=req.userId;

    try{

        // const cartData=await CartModel.find({userId:loggedInUser}).populate("productId",["title","description","price","category"]);

        const cartData=await CartModel.find({userId:loggedInUser}).populate("productId");

        return successHelper(res,"Cart Data",200,cartData);

    }
    catch(err){
        return errorHelper(res,err);

    }

}

const incDecCart=async(req,res)=>{

  const {productId} = req.params;
  
  
  const {operation} = req.body;

  console.log("operation to perform  :-",operation);

  try{

    if( typeof operation === 'string' && operation === "inc")
    {
      const cartInstance=await CartModel.findByIdAndUpdate(productId,{$inc:{quantity:1}},{new:true});


      return successHelper(res,"Cart Incremented Successfully",200,cartInstance);
    }
    else if(typeof operation === 'string' && operation === "dec")
    {
      const cartInstance=await CartModel.findByIdAndUpdate(productId,{$inc:{quantity:-1}},{new:true});

      if(cartInstance.quantity <= 0)
      {
        await CartModel.findByIdAndDelete(productId);
        return successHelper(res,"Cart Item Deleted Successfully",200);
      }

      return successHelper(res,"Cart Decremented Successfully",200,cartInstance);
    }

  }
  catch(err){

    return errorHelper(res,err);
  }

}


// --------------- Delete cart Product

const deleteCartProduct=async(req,res)=>{

  const {productId} = req.params;

  try{

    await CartModel.findByIdAndDelete(productId);

    return successHelper(res,"Cart Item Deleted Successfully",200);

  }
  catch(err){

    return errorHelper(res,err);
  }

}


// -------------------------- Create order 

const createOrder=async(req,res)=>{
  const loggedInUser=req.userId;

  try{

    const cartInstance=await CartModel.find({userId:loggedInUser}).populate("productId");

    const totalPrice=cartInstance.reduce((total,item)=>total+item.productId.price*item.quantity,20);
    const totalQuantity=cartInstance.reduce((total,item)=>total+item.quantity,0);


    const newOrder=new createOrderModel({
      userId:loggedInUser,
      grandTotal:totalPrice,
      itemTotal:totalPrice-20,
      product:cartInstance,
      numOfProducts:totalQuantity

    });

    await newOrder.save();

    if(!newOrder)
    {
      return errorHelper(res,{message:"Failed to create Order",status:500});
    }

    return successHelper(res,"Order created SUccessful",201,newOrder)



  }catch(err){
    return errorHelper(res,err);

  }
  


}



// ------------------get my order details


const getMyOrderDetails=async(req,res)=>{

  const loggedInUser=req.userId;

  try{

    const myOrder=await createOrderModel.aggregate([
      {
      $match:{userId:new mongoose.Types.ObjectId(loggedInUser)},
    },
    {$unwind:"$product"},
    {
      $lookup:{
        from:"products",
        localField:"product.productId",
        foreignField:"_id",
        as:"product"
      }
      
    }  
  ]);

    if(!myOrder)
    {
      return errorHelper(res,{message:"No Order Found",status:404});
    }

    return successHelper(res,"My Order Details",200,myOrder)

  }catch(err){
    return errorHelper(res,err);

  }

}


export { addToCart,getCartData,incDecCart,deleteCartProduct,createOrder,getMyOrderDetails };
