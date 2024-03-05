import { Router } from "express";
import User from "../dao/db/models/user.model.js";


const AuthRoute = Router();

AuthRoute.post('/register', async (req, res) => {
    try {
      const newUser = await User.create(req.body);
        res.redirect('/api/view/login-view');
    } catch (error) {

        console.error('Error al registrar usuario:', error);
      res.status(500).send('Error al registrar usuario');
    }
  });

AuthRoute.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) {
            req.session.user = user;
            return res.redirect('/api/view/perfil-view');
        } 
        else if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            const adminUser = { email: email, password: password, role: 'admin' };
            req.session.user = adminUser;
            return res.redirect('/api/view/perfil-view');
        }
        else {
            return res.status(401).send('Credenciales incorrectas');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return res.status(500).send('Error al iniciar sesión');
    }
});



AuthRoute.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/login-view');
    });
});

export default AuthRoute;