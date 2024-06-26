import Product from '../../dao/db/models/product.model.js';
import Message from '../../dao/db/models/chat.model.js';

export const getProducts = async (req, res) => {
  try {
    let products = await Product.find().lean();
    res.render('home', { products });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error interno del servidor");
  }
};

export const getProductDetails = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).lean();
    res.render('productDetails', { product });
  } catch (error) {
    console.error("Error al obtener detalles del producto:", error);
    res.status(500).send("Error interno del servidor");
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.render('chat', { messages });
  } catch (error) {
    console.error('Error al obtener mensajes del chat:', error);
    res.status(500).send('Error interno del servidor');
  }
};

export const postChatMessage = async (req, res) => {
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
};
