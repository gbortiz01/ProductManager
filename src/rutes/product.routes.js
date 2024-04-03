import express from 'express';
import {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';

const routerProd = express.Router();

routerProd.get('/', getProducts);
routerProd.get('/:id', getProductById);
routerProd.post('/', addProduct);
routerProd.put('/:id', updateProduct);
routerProd.delete('/:id', deleteProduct);

export default routerProd;

