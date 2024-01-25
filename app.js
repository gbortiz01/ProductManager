import express from 'express';
import handlebars from 'express-handlebars';
import routerProd from './src/product.routes.js'
import routerCart from './src/cart.routes.js';
import homeRoute from './src/home.route.js'
import { __dirname } from './path.js'
import path from 'path'
import { Server } from 'socket.io';
import http from 'http';


const app = express ();
const server = http.createServer(app);

const io = new Server(server);

const PORT = 8080 || process.env.PORT

app.use(express.static(__dirname +'/public'));


app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname + '/views'));

let messages = []

io.on('connection', (socket) => {
  console.log('User conectado');
  socket.emit('products', messages);
  socket.on('new-product', (data) => {
    console.log(data);
    messages.push(data);
    io.sockets.emit('products', messages);
  });
});



app.use(express.json());  
app.use(express.urlencoded({ extended: true }));


app.use('/api', homeRoute);
app.use('/api/products', routerProd); 
console.log(path.join(__dirname, '/public'));
app.use('/api/carts', routerCart);

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
