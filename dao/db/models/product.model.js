import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    title:{
        type: String,
        unique: true,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    stock: {
        type: Number,
        default: 10
    },
    description: {
        type: String,
        require: true
    },
    code: {
        require: true,
        type: String
    }
})

const Product = mongoose.model('products', ProductSchema)

export default Product; 