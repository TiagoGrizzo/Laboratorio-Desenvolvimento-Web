import {Router} from "express";
import UsuarioController from "../Controllers/UsuarioController.js";

const routesUsuario = new Router();

routesUsuario.post("/createUsuario", UsuarioController.Create);
routesUsuario.post("/login", UsuarioController.Login);

export default routesUsuario;