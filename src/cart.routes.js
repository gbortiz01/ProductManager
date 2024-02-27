import { Router } from 'express';
import Cart from "../dao/db/models/cart.model.js";
import { ProductManager } from "../ProductManager.js";

const routerCart = Router();
const productManager = new ProductManager();

routerCart.get('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await Cart.findById(cartId).populate('products.product');
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

routerCart.get('/:id', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id).populate('products.product');
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

routerCart.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    let cart = await Cart.findById(cartId);
    if (!cart) {
      cart = new Cart();
    }

    const product = await productManager.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const existingProductIndex = cart.products.findIndex(item => item.product.toString() === productId);
    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity++;
    } else {
      cart.products.push({ product: productId });
    }

    await cart.save();

    res.status(201).json({ message: 'Producto agregado al carrito correctamente', data: cart });
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

routerCart.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    let cart = await Cart.findById(cartId);
    if (!cart) {
      const currentDate = new Date(); 
      const cart = new Cart({ date: currentDate });
      await cart.save()
    }

    const product = await productManager.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const existingProductIndex = cart.products.findIndex(item => item.product.toString() === productId);
    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity++;
    } else {
      cart.products.push({ product: productId });
    }

    await cart.save();

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

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }

    cart.products.splice(productIndex, 1);
    await cart.save();

    res.status(200).json({ message: 'Producto eliminado del carrito correctamente', data: cart });
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

routerCart.put('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const { products } = req.body;

    const cart = await Cart.findByIdAndUpdate(cartId, { products }, { new: true });

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.status(200).json({ message: 'Carrito actualizado correctamente', data: cart });
  } catch (error) {
    console.error('Error al actualizar carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

routerCart.delete('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;

    const cart = await Cart.findByIdAndDelete(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.status(200).json({ message: 'Carrito eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});






export default routerCart;
