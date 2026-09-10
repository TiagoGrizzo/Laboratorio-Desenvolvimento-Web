import {Router} from "express";
import TarefaController from "../Controllers/ChatController.js";
import UserMiddleare from "../Middleware/UserMiddleware.js";
import ChatController from "../Controllers/ChatController.js";
const routesChat = new Router();

routesChat.get("/getHistory/:tarefaId", UserMiddleare, ChatController.getHistory);

export default routesChat;