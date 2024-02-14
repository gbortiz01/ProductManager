import { Router } from "express";
import Cart from "../dao/db/models/cart.model.js"; 
import Product from "../dao/db/models/product.model.js";

const routerCart = Router();

routerCart.get('/', async (req, res) => {
  try {b  
    const carts = await Cart.find();
    res.status(200).json({
      msg: 'Carritos encontrados',
      data: carts
    });
  } catch (error) {
    console.error('Error al obtener los carritos:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

routerCart.get('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.productId');
    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

routerCart.post('/add/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;

    let cart = await Cart.findOne();

    if (!cart) {
      cart = new Cart();
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (!cart.products) {
      cart.products = []; 
    }
    const existingProductIndex = cart.products.findIndex(item => item.productId === productId);

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += 1;
    } else {
      cart.products.push({ productId: productId, quantity: 1 });
    }
    await cart.save();

    res.status(201).json({ message: 'Producto agregado al carrito correctamente', data: cart });
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});




export default routerCart;




