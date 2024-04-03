import { Router } from 'express';
import * as authController from '../controllers/authController.js';

const authRouter = Router();

authRouter.post('/register', authController.registerUser);
authRouter.get('/register/github', authController.loginGithub);
authRouter.get('/register/github/callback', authController.loginGithubCallback);
authRouter.post('/login', authController.loginUser);
authRouter.get('/logout', authController.logoutUser);
authRouter.get('/current', authController.getCurrentUser);

export default authRouter;
