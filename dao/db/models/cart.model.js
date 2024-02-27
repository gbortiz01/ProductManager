import mongoose from 'mongoose';
import Product from './product.model.js'; 

const CartSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now 
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product" 
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]
});

CartSchema.pre('find', function(){
    this.populate("products.product");
});

const Cart = mongoose.model('Cart', CartSchema);

export default Cart;
