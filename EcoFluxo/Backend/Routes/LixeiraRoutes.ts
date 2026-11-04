import { Router } from 'express';
import { autenticacaoToken, autorizacaoPerfil } from "../Middlewares/seguranca.js";
import LixeiraController from '../Controllers/LixeiraController.js';

const routerLixeira = Router();
routerLixeira.post("/createLixeira", LixeiraController.Create);
routerLixeira.get("/lixeiras", LixeiraController.getLixeiras)


export default routerLixeira;
