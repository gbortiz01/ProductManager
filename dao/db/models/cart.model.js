import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
    title : {
        type: String,
        require: true,
        unique: true,
    },
    quantity: {
        type: Number,
        default: 1
    }
})

const Carts = mongoose.model('carts', CartSchema)

export default Carts