import { Router } from "express";
import AuthRoute from "./auth.routes.js";
import Product from "../dao/db/models/product.model.js";

const ViewRoute = Router();

ViewRoute.get('/login', (req, res) => {
    res.render('login');
});

ViewRoute.get('/register', (req, res) => {
    res.render('register');
});


ViewRoute.get('/perfil', async (req, res) => {
    try {
        const products = await Product.find();
        const user = req.session.user; 
        res.render('profile', { user: req.session.user, products });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});




ViewRoute.use('/session', AuthRoute);

export default ViewRoute;

