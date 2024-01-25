import { Router } from "express";
import { ProductManager } from '../ProductManager.js';

const homeRoute = Router();
const productManager = new ProductManager('./products.json');

homeRoute.get('/home', (req, res) => {
  productManager.getProduct().then((products) => {
    res.render('home', { products });
  });
});

homeRoute.get('/realtimeproducts', async (req, res) => {
  res.render('realtimeproducts', {})
});

export default homeRoute;
