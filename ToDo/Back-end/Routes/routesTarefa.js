import {Router} from "express";
import TarefaController from "../Controllers/TarefaController.js";

/*
Verbos HTTP
get
post
delete
put -> alterar tudo
patch -> alterar parte
 */

const routesTarefa = new Router();

routesTarefa.post("/create", TarefaController.Create);  //Após o ponto "." temos que usar o verbo/requisição HTTP
routesTarefa.get("/getAll", TarefaController.getAll);

export default routesTarefa;