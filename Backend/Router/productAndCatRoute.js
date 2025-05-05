import {addCategory,deleteCategory,updateCategory,getAllCategories} from '../Controllers/categoryController.js';

import userAuthMiddleware from '../Middleware/userAuthMiddleware.js'

import { add, get, update, del, getProductsByUserId,productReviewSection } from '../Controllers/productController.js'

import express from 'express';
import upload from '../Helper/imgUploadHelper.js'

import {addToCart,getCartData,incDecCart,deleteCartProduct,createOrder,getMyOrderDetails} from '../Controllers/cartController.js'


// excel router

import {excelCont,getInExcel} from '../Controllers/excelController.js'
import uploadAny from '../Helper/excleUploadHelper.js'




const router=express.Router();

// ------------------Product ROutes

router.post('/add',userAuthMiddleware,upload.array('images'),add);
router.get('/show',userAuthMiddleware,get);
router.put('/update/:productId',userAuthMiddleware,upload.array('images'),update);
router.delete('/delete/:productId',userAuthMiddleware,del);
router.get('/users',userAuthMiddleware,getProductsByUserId);




// -------------------- Category routes

router.post('/category/add',addCategory);
router.post('/category/delete',deleteCategory);
router.put('/category/update/:categoryId',updateCategory);
router.get('/category/show',getAllCategories);


// --------------- Add to cart


router.post('/cart',userAuthMiddleware,addToCart);
router.get('/cart/products',userAuthMiddleware,getCartData);
router.put('/cart/quantityUpdate/:productId',userAuthMiddleware,incDecCart);

router.delete('/cart/productDelete/:productId',userAuthMiddleware,deleteCartProduct);


// ------------------ Order routes

router.post('/order',userAuthMiddleware,createOrder);


router.get('/order/myDetails',userAuthMiddleware,getMyOrderDetails);


// -------------------------------product review section

router.post('/review',userAuthMiddleware,productReviewSection);



// ------------excel controller route

router.post('/excel/upload',userAuthMiddleware,uploadAny.single('file'),excelCont);
router.get('/excel/download',getInExcel);



// ---------------------search routes



export default router;


