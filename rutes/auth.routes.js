import { Router } from "express";
import User from "../dao/db/models/user.model.js";


import passport from "passport";

const authRouter = Router();

authRouter.post('/register', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        const newCart = await Cart.create({ products: [], user: newUser._id });
        newUser.cart = newCart._id;
        await newUser.save();

        res.redirect('/api/view/login');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).send('Error al registrar usuario');
    }
});

authRouter.get('/register/github', passport.authenticate('github'));

authRouter.get('/register/github/callback', passport.authenticate('github', { failureRedirect: '/api/view/login' }), async (req, res) => {
    try {
        const githubUser = req.user;
        const newCart = await Cart.create({ products: [], user: githubUser._id });
        githubUser.cart = newCart._id;
        await githubUser.save();

        res.redirect('/api/view/perfil');
    } catch (error) {
        console.error('Error al procesar la autenticación de GitHub:', error);
        res.status(500).send('Error al procesar la autenticación de GitHub');
    }
});

authRouter.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        console.log("Ejecutando la estrategia de autenticación local...");
        if (err) {
            console.error("Error durante la autenticación:", err);
            return next(err);
        }
        if (!user) {
            console.log("Usuario no encontrado");
            return res.redirect('/api/view/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error("Error al iniciar sesión:", err);
                return next(err);
            }
            console.log("Inicio de sesión exitoso:", user);
            return res.redirect('/api/view/perfil');
        });
    })(req, res, next);
});

authRouter.get('/current', (req, res) => {
    if (req.isAuthenticated()) { 
        res.json({ user: req.user });
    } else {
        res.status(401).json({ message: 'No hay usuario autenticado' });
    }
});

export default authRouter;

