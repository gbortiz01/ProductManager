import express from 'express';
import {
  getProducts,
  getProductDetails,
  getChatMessages,
  postChatMessage
} from '../controllers/homeController.js';

const homeRoute = express.Router();

homeRoute.get('/products', getProducts);
homeRoute.get('/products/:id', getProductDetails);
homeRoute.get('/chat', getChatMessages);
homeRoute.post('/chat', postChatMessage);

export default homeRoute;
