import express from "express";
import cors from "cors";
import routes from "./Routes/routes.js";
import swaggerUI from "swagger-ui-express";
import {createRequire} from "module";
//suporte para importar arquivos json usando ESModules
const require = createRequire(import.meta.url);
const swaggerDocument = require("./swagger-output.json");
//incluir as rotas
const app = new express();
//comunicação ente front e back usar json
app.use(express.json);
app.use(cors({
    credential: true,
    origin: "http://localhost:3000"
}));
//obrigatoriamente o swagger deve vir antes das rotas (app.use("ToDo", routes))
app.use("./docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
//ligar o express com as rotas
app.use("ToDo", routes)
app.listen(5000) // em qual porta o back-end vai rodar