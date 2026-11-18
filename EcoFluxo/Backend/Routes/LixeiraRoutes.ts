import { Router } from 'express';
import { autenticacaoToken, autorizacaoPerfil } from "../Middlewares/seguranca.js";
import LixeiraController from '../Controllers/LixeiraController.js';

const routerLixeira = Router();

// Cadastro: exige estar logado e ser GESTOR
routerLixeira.post("/createLixeira", autenticacaoToken, autorizacaoPerfil("GESTOR"), LixeiraController.Create);

// Listagem: exige estar logado
routerLixeira.get("/lixeiras", autenticacaoToken, LixeiraController.getLixeiras);

export default routerLixeira;