import productModel from "../Module/productModel.js";

import CategoryModel from "../Module/productCategoryModel.js";
import mongoose from "mongoose";
// const ObjectId = mongoose.Types.ObjectId;

import {
  errorHelper,
  successHelper,
  validatorHelper,
} from "../Helper/globalHelper.js";

import ReviewModel from "../Module/reviewModel.js";

import createOrderModel from "../Module/orderModel.js";

const add = async (req, res) => {
  const loggedInUserId = req.userId;

  console.log("files ===>", req.files);

  // --------------checking user has given all requried field or not

  const { title, description, size, category, price } = req.body;
  console.log("req.body: ", req.body);

  const rules = {
    title: "required|string",
    description: "required|string",
    size: "required|string",
    category: "required|string",
    price: "required|string",
  };

  const matched = validatorHelper(req.body, rules);

  if (!matched) {
    return errorHelper(res, {
      message: "All Fields are required",
      status: 422,
    });
  }

  try {
    // ---------category checking
    const categoryCheck = await CategoryModel.findById(req.body.category);

    if (!categoryCheck) {
      return errorHelper(res, { message: "Category Not Found", status: 404 });
    }

    // ------------------- images check

    console.log("req.files:------> ", req.files);

    // -----------adding new product

    const newProduct = new productModel({
      title,
      description,
      images: req.files,
      size,
      category,
      userId: loggedInUserId,
      price,
    });

    const product = await newProduct.save();

    if (!product) {
      return errorHelper(res, { message: "Product Not Saved", status: 400 });
    }

    return successHelper(res, "Product added successfully", 201, product);
  } catch (err) {
    return errorHelper(res, err);
  }
};

// ---------product update

const update = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return customErrorHandler(
        "Product ID is required while updating data",
        400
      );
    }

    const updatedData = await productModel.findByIdAndUpdate(
      productId,
      { ...req.body, images: req.files },
      { new: true }
    );

    if (!updatedData) {
      return errorHelper(res, { message: "Product Not Found", status: 404 });
    }

    return successHelper(res, "Product Detail Updated", 200, updatedData);
  } catch (err) {
    return errorHelper(res, err);
  }
};

// ----------------------product delete
const del = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return errorHelper(res, {
        message: "Product ID is required while deleting data",
        status: 400,
      });
    }

    const productDeleted = await productModel.findByIdAndDelete(productId);

    if (!productDeleted) {
      return errorHelper(res, { message: "Product Not Found", status: 404 });
    }

    return successHelper(res, "Product deleted successfully", 200);
  } catch (err) {
    return errorHelper(res, err);
  }
};

const getProductsByUserId = async (req, res) => {
  try {
    const loggedInUserId = req.userId;

    const userProducts = await productModel.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(loggedInUserId) },
      },
      {
        $lookup: {
          from: "productcategories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
    ]);

    if (!userProducts) {
      return errorHelper(res, {
        message: "No any Product found for this user",
        status: 404,
      });
    }

    return successHelper(res, "User's Products", 200, userProducts);
  } catch (err) {
    return errorHelper(res, err);
  }
};

// ---------product get

// const get = async (req, res) => {
//   try {
//     const gettingAppProducts = await productModel.find();

//     if (!gettingAppProducts) {
//       return errorHelper(res,{message:"No any Product found",status: 404});
//     }

//     return successHelper(res, "All Products", 200, gettingAppProducts);
//   } catch (err) {
//     return errorHelper(res, err);
//   }
// };

const get = async (req, res) => {
  // const loggedInUser=req.userId;

  try {
    const gettingAppProducts = await productModel.aggregate([
      {
        $lookup: {
          from: "carts",
          let: { fromProductModel: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$productId", "$$fromProductModel"] },
              },
            },
          ],
          as: "productInCart",
        },
      },
      {
        $addFields: {
          isCart: { $gt: [{ $size: "$productInCart" }, 0] }, // If cart array has items, set isCart to true
        },
      },
    ]);

    if (!gettingAppProducts) {
      return errorHelper(res, { message: "No any Product found", status: 404 });
    }

    return successHelper(res, "All Products", 200, gettingAppProducts);
  } catch (err) {
    return errorHelper(res, err);
  }
};

// -----------product review section

const productReviewSection = async (req, res) => {
  const loggedInUser = req.userId;

  const { productId, orderId, rating, review } = req.body;
  console.log("req.body :====>", req.body);

  const rules = {
    productId: "required|string",
    orderId: "required|string",
    rating: "required|string",
    review: "required|string",
  };

  const matched = await validatorHelper(req.body, rules);


  console.log("matched : ==> ", matched);

  if (!matched) {
    return errorHelper(res, {
      message: "All Fields are required",
      status: 422,
    });
  }

  try {
    // --------checking order id present or not

    const isOrderAvailable = await createOrderModel.find({
      $and: [{ _id: orderId }, { orderStatus: "Confirmed" }],
    });

    if (!isOrderAvailable) {
      return errorHelper(res, {
        message: "Order Not Found and can't do review",
        status: 404,
      });
    }

    // ----------if same order id of product exist then adding product reviews

    const update = await ReviewModel.findOneAndUpdate(
      { orderId, productId, userId: loggedInUser },
      { $set: { productId, rating, review } },  
      { upsert: true },
    );
  

    return successHelper(res, "Product Review Added", 201, update);
  } catch (err) {
    return errorHelper(res, err);
  }
};

export { add, get, update, del, getProductsByUserId, productReviewSection };



