import express from 'express';
import handlebars from 'express-handlebars';
import routerProd from './src/product.routes.js'
import routerCart from './src/cart.routes.js';
import homeRoute from './src/home.route.js'
import { __dirname } from './path.js'
import path from 'path'
import http from 'http';
import { Server } from 'socket.io';
import DataBase from './dao/db/db.js'
import Message from './dao/db/models/chat.model.js';



const app = express ();
const server = http.createServer(app); 


const PORT = 8080 || process.env.PORT

app.use(express.static(__dirname+"/public"));


app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname+'/views'));

app.use(express.json());  
app.use(express.urlencoded({ extended: true }));


app.use('/api', homeRoute);
app.use('/api/product', routerProd); 
app.use('/api/carts', routerCart);

const io = new Server(server);

io.on('connection', (socket) => {
  console.log('Usuario conectado');
  socket.emit('wellcome', 'Bienvenido Cliente nuevo');

  socket.on('new-message', async (data) => {
    try {
      const newMessage = new Message({
        user: data.author,
        message: data.text
      });
      await newMessage.save();
      const messages = await Message.find();
      io.sockets.emit('message-all', messages);
    } catch (error) {
      console.error('Error al guardar el mensaje en la base de datos:', error);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
  DataBase.connect()
});
