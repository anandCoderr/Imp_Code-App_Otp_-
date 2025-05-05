import mongoose from 'mongoose';

const cart=new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'product'
    },
    quantity:{
        type: Number,
        required: true,
        default: 1
    }

},{
    timestamps: true,
});

const CartModel=mongoose.model('Cart',cart);

export default CartModel;