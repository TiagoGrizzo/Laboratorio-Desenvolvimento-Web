import {Router} from "express";
import TarefaController from "../Controllers/TarefaController.js";
import UserMiddleware from "../Middleware/UserMiddleware.js";
const routesTarefa = new Router();

routesTarefa.post("/create", UserMiddleware, TarefaController.Create);
routesTarefa.get("/getAll", UserMiddleware, TarefaController.getAll);
routesTarefa.patch("/updateSituacao/:id", UserMiddleware, TarefaController.updateSituacao); //Adicionando a rota do novo metodo
//usamos o patch porque vamos mudar apenas a situação da tarefa

export default routesTarefa;