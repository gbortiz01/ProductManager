import { Router } from "express";
import { cartManager } from "../cartManager.js";

const routerCart = Router();
const CartManager = new cartManager('./products.json', './carts.json');

routerCart.post('/', async (req, res) => {
  try {
    const cart = await CartManager.createCart();
    res.status(201).json(cart);
  } catch (error) {
    console.error('Error al crear un nuevo carrito:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

})

routerCart.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const cart = await CartManager.getCartById(cartId);
    if (cart) {
        res.status(200).json(cart.products);
      } else {
        res.status(404).json({ error: 'Cart not found' });
      }    
})

routerCart.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const success = await CartManager.addProductToCart(cartId, productId);

    if (success) {
      res.status(201).send('Producto agregado a tu carrito con exito');
    } else {
      res.status(404).json({ error: 'Producto no agregado :(' });
    }

})

export default routerCart;