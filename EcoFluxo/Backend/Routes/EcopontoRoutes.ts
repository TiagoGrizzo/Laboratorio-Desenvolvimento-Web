import { Router } from 'express';
import { autenticacaoToken, autorizacaoPerfil } from "../Middlewares/seguranca.js";
import EcopontoController from '../Controllers/EcopontoController.js';

const routerEcoponto = Router();

// Cadastro: exige estar logado e ser GESTOR
routerEcoponto.post("/createEcoponto", autenticacaoToken, autorizacaoPerfil("GESTOR"), EcopontoController.Create);

// Listagem: exige estar logado
routerEcoponto.get("/ecopontos", autenticacaoToken, EcopontoController.getEcopontos);

export default routerEcoponto;