import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now 
    },
    products: [{
        product: { 
            type: mongoose.Schema.Types.ObjectId,  
            ref: 'Product',  
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]
});

CartSchema.pre('find', function(next) {
    this.populate('products.product');
    next();
});

CartSchema.index({ 'products.product': 1 }, { unique: false });

const Cart = mongoose.model('Cart', CartSchema);

export default Cart;
