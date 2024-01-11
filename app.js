const express = require('express');
const ProductManager = require ('./ProductManager.js');

const app = express()
const PORT = 8080;


const Product = new ProductManager();

app.get('/Bienvenida', (req,res) =>{
    res.send('<h1 style= "color:blue">¡BIENVENIDOS/AS!</h1>')
})

app.get('/products', (req, res) => {
    const limit = parseInt(req.query.limit, 10);
    const productsToSend = Product.getProduct(limit);
    res.json(productsToSend);
});


app.get('/products/:pid', (req,res) =>{

    const productId = parseInt(req.params.pid, 10);
    const product = Product.getProductById(productId);

    if (!product) {
        return res.status(404).json({ error: 'PRODUCTO NO ENCONTRADO' });
    }

    res.json (product);
})

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
