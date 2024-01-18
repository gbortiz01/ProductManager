import { promises as fs } from 'fs' 
import uuid4 from 'uuid4';

export class cartManager {
        constructor (productsPath, cartsPath){
        this.productsPath = productsPath;
        this.cartsPath = cartsPath }


        async createCart() {
            const cartId = uuid4();
            const cart = { id: cartId, products: [] };
        
            const carts = await this.readCartsFile();
            carts.push(cart);
        
            await this.writeCartsFile(carts);
            return cart;
          }

        async getCartById(cartId) {
            const carts = await this.readCartsFile();
            const cart = carts.find((c) => c.id === cartId);
            return cart;
          }
        
          async addProductToCart(cartId, productId) {
            const carts = await this.readCartsFile();
            const cartIndex = carts.findIndex((c) => c.id === cartId);
        
            if (cartIndex !== -1) {
              const productIndex = carts[cartIndex].products.findIndex((p) => p.product === productId);
        
              if (productIndex !== -1) {
                carts[cartIndex].products[productIndex].quantity++;
              } else {
                carts[cartIndex].products.push({ product: productId, quantity: 1 });
              }
        
              await this.writeCartsFile(carts);
              return true;
            }
        
            return false;
          }

          async readCartsFile() {
            try {
              const content = await fs.readFile(this.cartsPath, 'utf-8');
              return JSON.parse(content);
          } catch (error) {
              console.error('Error al leer/analizar el archivo de carritos:', error);
              return []; // Otra opción es lanzar el error si lo prefieres: throw error;
          }
      }
          
        
          async writeCartsFile(carts) {
            await fs.writeFile(this.cartsPath, JSON.stringify(carts, null, 2));
          }
}

