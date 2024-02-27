import mongoose from 'mongoose';
import mongoPaginate from 'mongoose-paginate-v2';

const ProductSchema = new mongoose.Schema({
    title:{
        type: String,
        unique: true,
        required: true 
    },
    price: {
        type: Number,
        required: true 
    },
    stock: {
        type: Number,
        default: 10
    },
    description: {
        type: String,
        required: true 
    },
    code: {
        required: true, 
        type: String
    },
    category: {
        type: String,
        required: true 
    }
});

ProductSchema.plugin(mongoPaginate);

const Product = mongoose.model('Product', ProductSchema); 

export default Product;
