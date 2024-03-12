import { Router } from 'express';
import Cart from "../dao/db/models/cart.model.js";
import { CartManager } from "../CartManager.js";

const routerCart = Router();
const cartManager = new CartManager();

routerCart.get('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.render('cartDetail', { cart: cart.toJSON() });  
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).send('Error interno del servidor al renderizar la vista');
  }
});

routerCart.get('/', async (req, res) => {
  try {
    const carts = await cartManager.getAllCarts();
    res.status(200).json({
      msg: 'Carritos encontrados',
      data: carts
    });
  } catch (error) {
    console.error('Error al obtener los carritos:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

routerCart.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    let cart = await Cart.findById(cartId);
    if (!cart) {
      cart = new Cart();
    }

    const productAdded = await cartManager.addProductToCart(cartId, productId);
    if (!productAdded) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(201).json({ message: 'Producto agregado al carrito correctamente', data: cart });
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


routerCart.delete('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const productDeleted = await cartManager.removeProductFromCart(cartId, productId);
    if (!productDeleted) {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }

    res.status(200).json({ message: 'Producto eliminado del carrito correctamente', data: productDeleted });
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

routerCart.put('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const { products } = req.body;

    const updatedCart = await cartManager.updateCart(cartId, products);
    if (!updatedCart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.status(200).json({ message: 'Carrito actualizado correctamente', data: updatedCart });
  } catch (error) {
    console.error('Error al actualizar carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

routerCart.delete('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;

    const deletedCart = await cartManager.deleteCart(cartId);
    if (!deletedCart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.status(200).json({ message: 'Carrito eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default routerCart;
