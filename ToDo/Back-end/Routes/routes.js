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

const routes = new Router();

routes.post("/create", TarefaController.Create);  //Após o ponto "." temos que usar o verbo/requisição HTTP
routes.get("/getAll", TarefaController.getAll);

export default routes;