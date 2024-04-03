import { Router } from "express";
import { renderLogin, renderRegister, renderProfile } from "../controllers/viewController.js";
import AuthRoute from "./auth.routes.js";

const ViewRoute = Router();

ViewRoute.get('/login', renderLogin);
ViewRoute.get('/register', renderRegister);
ViewRoute.get('/perfil', renderProfile);

ViewRoute.use('/session', AuthRoute);

export default ViewRoute;
