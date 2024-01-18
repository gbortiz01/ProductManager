import { Router } from "express";
import { ProductManager } from '../ProductManager.js';

const routerProd = Router();
const productManager = new ProductManager('./products.json');

routerProd.get('/', async (req, res) => {
  const { limit } = req.query;
  const prods = await productManager.getProduct();
  const products = prods.slice(0, limit);
  res.status(200).send(products);
});

routerProd.get('/:id', async (req, res) => {
  const productId = req.params.id;
  const prod = await productManager.getProductById(productId);

  if (prod) {
    res.status(200).send(prod);
  } else {
    res.status(404).send("Producto no encontrado");
  }
});

routerProd.post('/', async (req, res) => {
  const productData = req.body;
  const conf = await productManager.addProduct(productData);
  if (conf) {
    res.status(201).send("Producto creado");
  } else {
    res.status(400).send("Error al agregar el producto. Todos los campos son obligatorios.");
  }
});

routerProd.put('/:id', async (req, res) => {
  const productId = req.params.id;
  const conf = await productManager.updateProduct(productId, req.body);

  if (conf) {
    res.status(200).send("Producto actualizado con éxito");
  } else {
    res.status(404).send("Producto no encontrado");
  }
});

routerProd.delete('/:id', async (req, res) => {
  const productId = req.params.id;
  const conf = await productManager.deleteProduct(productId);

  if (conf) {
    res.status(200).send("Producto eliminado correctamente");
  } else {
    res.status(404).send("Producto no encontrado");
  }
});

export default routerProd;
