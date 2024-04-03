import Product from "../../dao/db/models/product.model.js";

export const renderLogin = (req, res) => {
    res.render('login');
};

export const renderRegister = (req, res) => {
    res.render('register');
};

export const renderProfile = async (req, res) => {
    try {
        const products = await Product.find();
        const user = req.session.user; 
        res.render('profile', { user, products });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
};
