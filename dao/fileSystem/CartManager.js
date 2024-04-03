import Cart from '../db/models/cart.model.js';
import Product from '../db/models/product.model.js';

class CartManager {
    async addProductToCart(cartId, productId) {
        try {
            let cart;
            if (cartId) {
                cart = await Cart.findById(cartId);
            }
            if (!cart) {
                const currentDate = new Date().toISOString();
                cart = new Cart({ date: currentDate, products: [] });
            }
            const product = await this.getProductById(productId);
            if (!product) {
                return false;
            }
          cart.products.push({ product: productId });
          await cart.save();

            return true;
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            return false;
        }
    }
    async getProductById(productId) {
        try {
            return await Product.findById(productId);
        } catch (error) {
            console.error('Error al obtener producto por ID:', error);
            return null;
        }
    }

    async getAllCarts() {
        try {
            const carts = await Cart.find();
            return carts;
        } catch (error) {
            console.error('Error al obtener los carritos:', error);
            throw error;
        }
    }

    async getProductCart() {
        try {
            const cart = await Cart.findOne({ products: [] });
            if (!cart) {
                const currentDate = new Date().toISOString();
                return await Cart.create({ date: currentDate, products: [] });
            }
            return cart;
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            throw error;
        }
    }
}

export default CartManager;
