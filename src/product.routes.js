import { Router } from "express";
import Product from '../dao/db/models/product.model.js';

const routerProd = Router();

routerProd.get('/', async (req, res) => {
  try {
      let products = await Product.find(); 
      res.send({
          msg: 'Productos encontrados',
          data: products
      });
  } catch (err) {
      res.status(500).json({ message: err.message }); 
  }
});


routerProd.get('/:id', async (req, res) => {
    try {
        const product = await product.findById(req.params.id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

routerProd.post('/', async (req, res) => {
    try {
        await Product.create(req.body)
        res.status(201).send({
          msg : 'Producto Creado',
          data : req.body
        })
    } catch (err) {
        console.log(err)
    }
});

routerProd.put('/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findByIdAndUpdate(productId, req.body, { new: true });
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

routerProd.delete('/:id', async (req, res) => {
  try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (deletedProduct) {
          res.status(200).json({ message: "Producto eliminado correctamente" });
      } else {
          res.status(404).json({ message: "Producto no encontrado" });
      }
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});


export default routerProd;
