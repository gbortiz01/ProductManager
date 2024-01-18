import express from 'express';
import routerProd from '../Desafio Ortiz Belen/src/product.routes.js'
import routerCart from './src/cart.routes.js';
import { __dirname } from './path.js'
import path from 'path'


const app = express();
const PORT = 8080;

app.use(express.json());  
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', routerProd); 
app.use('/static', express.static(path.join(__dirname, '/public')))
console.log(path.join(__dirname, '/public'))
app.use('/api/carts', routerCart)

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
