import express from 'express';
import handlebars from 'express-handlebars';
import routerProd from './src/product.routes.js'
import routerCart from './src/cart.routes.js';
import homeRoute from './src/home.route.js'
import ViewRoute from './src/views.routes.js';
import AuthRoute from './src/auth.routes.js';
import { __dirname } from './path.js'
import path from 'path'
import http from 'http';
import { Server } from 'socket.io';
import DataBase from './dao/db/db.js'
import Message from './dao/db/models/chat.model.js';
import session from 'express-session'; 
import FileStore from 'session-file-store';
import MongoStore from 'connect-mongo';

const app = express ();
const server = http.createServer(app); 


const PORT = 8080 || process.env.PORT

app.use(express.static(__dirname+"/public"));



app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname+'/views'));

app.use(express.json());  
app.use(express.urlencoded({ extended: false }));

app.use(session({
  store:MongoStore.create({
    mongoUrl: 'mongodb+srv://giselabelenortiz:3pPbZG0naeHtWTVA@cluster0.ab5jnzr.mongodb.net/ecommerce',
    ttl:10
  }),
  secret:"adminCod3r123",
  resave: true,
  saveUninitialized: true
}))

app.get('/sessionSet', (req, res) =>{
  req.session.user = 'username'
  req.session.admin = true

  res.send('Usuario Logueado')

})

app.get('/sessionGet', (req,res) =>{
  res.send(req.session.user)
})

app.get('/logout', (req,res) =>{
  req.session.destroy((err)=>{
    if(err) res.send('Error en Logout')
    res.send('Logout ok!')
  })
})

app.use('/api', homeRoute);
app.use('/api/product', routerProd); 
app.use('/api/carts', routerCart);
app.use('/api/view', ViewRoute);
app.use('/api/session', AuthRoute);


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
