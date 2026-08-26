import {Router} from "express";
import UsuarioController from "../Controllers/UsuarioController.js";

/*
Verbos HTTP
get
post
delete
put -> alterar tudo
patch -> alterar parte
 */

const routesUsuario = new Router();

routesUsuario.post("/createUsuario", UsuarioController.Create);  //Após o ponto "." temos que usar o verbo/requisição HTTP //aqui NÃO pode ser só create, porque só create é a rota de tarefas

export default routesUsuario;