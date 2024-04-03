import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../../../dao/db/models/user.model.js';
import Cart from '../../../dao/db/models/cart.model.js';
import bcrypt from 'bcrypt';

export const initPassport = () => {
    passport.use('local', new LocalStrategy({
        usernameField: 'email'
    }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use('github', new GitHubStrategy({
        clientID: "Iv1.6ffe7901f4be7bb0",
        clientSecret: "068a53684f5d32a2a6f52c4e27ea51947638660f",
        callbackURL: "http://localhost:8080/api/view/perfil"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });

    passport.logoutUser = (req, res, next) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/api/view/login');
        });
    };
    
    
    
};
