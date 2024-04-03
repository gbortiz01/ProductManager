import { ProductManager } from '../../dao/fileSystem/ProductManager.js';

const productManager = new ProductManager();

export const getProducts = async (req, res) => {
    try {
        const products = await productManager.getProducts(req.query);
        res.status(200).json(products);
    } catch (err) {
        console.error('Error al obtener los productos:', err);
        res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addProduct = async (req, res) => {
    try {
        const createdProduct = await productManager.addProduct(req.body);
        if (createdProduct) {
            res.status(201).send({
                msg: 'Producto Creado',
                data: req.body
            });
        } else {
            res.status(400).json({ message: 'Datos de producto incorrectos' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error al crear el producto' });
    }
};

export const updateProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        const updatedProduct = await productManager.updateProduct(productId, req.body);
        if (updatedProduct) {
            res.status(200).json(updatedProduct);
        } else {
            res.status(404).json({ message: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await productManager.deleteProduct(req.params.id);
        if (deletedProduct) {
            res.status(200).json({ message: "Producto eliminado correctamente" });
        } else {
            res.status(404).json({ message: "Producto no encontrado" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
