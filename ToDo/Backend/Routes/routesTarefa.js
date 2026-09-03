import {Router} from "express";
import TarefaController from "../Controllers/TarefaController.js";
import UserMiddleare from "../Middleware/UserMiddleware.js";
const routesTarefa = new Router();

routesTarefa.post("/create", UserMiddleare, TarefaController.Create);
routesTarefa.get("/getAll", UserMiddleare, TarefaController.getAll);

export default routesTarefa;