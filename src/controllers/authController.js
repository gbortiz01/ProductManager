
import passport from 'passport';
import User from '../../dao/db/models/user.model.js';
import Cart from '../../dao/db/models/cart.model.js';

export const registerUser = async (req, res) => {
    try {
        const newCart = await Cart.create({ products: [] });
        const newUser = await User.create({...req.body, carts: [newCart._id] }); 
        res.redirect('/api/view/login');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).send('Error al registrar usuario');
    }
};

export const loginUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error("Error durante la autenticación:", err);
            return next(err);
        }
        if (!user) {
            console.log("Usuario no encontrado");
            return res.redirect('/api/view/login');
        }
        req.login(user, (err) => {
            if (err) {
                console.error("Error al iniciar sesión:", err);
                return next(err);
            }
            console.log("Inicio de sesión exitoso:", user);
            return res.redirect('/api/view/perfil');
        });
    })(req, res, next);
};


export const logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error al destruir la sesión:', err);
            res.status(500).send('Error');
        } else {
            return res.redirect('/api/view/login');

        }
    });
};

export const getCurrentUser = (req, res) => {
    if (req.isAuthenticated()) { 
        res.json({ user: req.user });
    } else {
        res.status(401).json({ message: 'No hay usuario autenticado' });
    }
};

export const loginGithub = passport.authenticate('github');

export const loginGithubCallback = async (req, res, next) => {
    passport.authenticate('github', { failureRedirect: '/api/view/login' }, async (err, user) => {
        if (err) {
            console.error("Error durante la autenticación de GitHub:", err);
            return next(err);
        }
        if (!user) {
            console.log("Usuario no encontrado");
            return res.redirect('/api/view/login');
        }
        try {
            const newCart = await Cart.create({ products: [], user: user._id });
            user.cart = newCart._id;
            await user.save();
        } catch (error) {
            console.error("Error al crear un nuevo carrito para el usuario de GitHub:", error);
            return next(error);
        }
        req.login(user, (err) => {
            if (err) {
                console.error("Error al iniciar sesión con el usuario de GitHub:", err);
                return next(err);
            }
            console.log("Inicio de sesión exitoso con el usuario de GitHub:", user);
            return res.redirect('/api/view/perfil');
        });
    })(req, res, next);
};
