import { Router } from 'express';
import {
  getCartById,
  getAllCarts,
  addProductToCart,
  removeProductFromCart,
  updateCart,
  deleteCart
} from '../controllers/cartController.js';

const routerCart = Router();

routerCart.get('/:cid', getCartById);

routerCart.get('/', getAllCarts);

routerCart.post('/:cid/product/:pid', addProductToCart);

routerCart.delete('/:cid/product/:pid', removeProductFromCart);

routerCart.put('/:cid', updateCart);

routerCart.delete('/:cid', deleteCart);

export default routerCart;
