import { Router } from "express";
import Product from '../dao/db/models/product.model.js';
import Message from '../dao/db/models/chat.model.js';

const homeRoute = Router();

homeRoute.get('/home', async (req, res) => {
  try {
    let products = await Product.find().lean();
    console.log(products);
    res.render('home', {products});
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

homeRoute.get('/chat', async (req, res) => {
  try {
      const messages = await Message.find();
      res.render('chat', { messages });
  } catch (error) {
      console.error('Error al obtener mensajes del chat:', error);
      res.status(500).send('Error interno del servidor');
  }
});


homeRoute.post('/chat', async (req, res) => {
  try {
    const { user, message } = req.body;
        const newMessage = new Message({
      user,
      message
    });
    await newMessage.save();
    res.redirect('/chat');
  } catch (error) {
    console.error('Error al guardar el mensaje en la base de datos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

export default homeRoute;
