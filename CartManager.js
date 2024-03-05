import Cart from './dao/db/models/cart.model.js';
import Product from './dao/db/models/product.model.js';

export class CartManager {
    async addProductToCart(cartId, productId) {
        try {
          let cart = await Cart.findById(cartId);
          if (!cart) {
            const currentDate = new Date().toISOString(); 
            cart = new Cart({ date: currentDate });
          }
      
          const product = await this.getProductById(productId); 
          if (!product) {
            return false;
          }
      
          const existingProductIndex = cart.products.findIndex(item => item.product.toString() === productId);
          if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity++;
          } else {
            cart.products.push({ product: productId });
          }
      
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
}

