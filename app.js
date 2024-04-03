import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import dotenv from 'dotenv';

import { __dirname as rootDirname } from './path.js';

import { initPassport } from './src/rutes/config/passport.config.js';
import homeRoute from './src/rutes/home.route.js';
import routerProd from './src/rutes/product.routes.js';
import routerCart from './src/rutes/cart.routes.js';
import viewRoute from './src/rutes/views.routes.js'; 
import authRoute from './src/rutes/auth.routes.js'; 
import DataBase from './dao/db/db.js';
import Message from './dao/db/models/chat.model.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(rootDirname, 'public')));

const hbs = exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(rootDirname, 'src', 'views'));

app.use(cookieParser());

const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
  ttl: 15 * 60,
  crypto: {
    secret: process.env.SESSION_SECRET
  },
  touchAfter: 24 * 3600,
});

app.use(session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET,
  resave: false, 
  saveUninitialized: false, 
  cookie: {
    maxAge: 1000 * 60 * 15 
  },
}));

app.use(passport.initialize());
app.use(passport.session()); 

initPassport();

app.use('/api', homeRoute);
app.use('/api/product', routerProd);
app.use('/api/carts', routerCart);
app.use('/api/view', viewRoute); // Corregido el nombre del enrutador
app.use('/api/session', authRoute); // Corregido el nombre del enrutador

io.on('connection', (socket) => {
  console.log('Usuario conectado');
  socket.emit('welcome', 'Bienvenido Cliente nuevo');

  socket.on('new-message', async (data) => {
    try {
      const newMessage = new Message({
        user: data.author,
        message: data.text
      });
      await newMessage.save();
      const messages = await Message.find();
      io.emit('message-all', messages);
    } catch (error) {
      console.error('Error al guardar el mensaje en la base de datos:', error);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
  DataBase.connect();
});
