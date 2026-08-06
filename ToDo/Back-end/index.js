import express from "express";
import cors from "cors";
//incluir as rotas
const app = new express();
//comunicação ente front e back usar json
app.use(express.json);
app.use(cors({
    credential: true,
    origin: "http://localhost:3000"
}));
//ligar o express com as rotas
app.listen(5000) // em qual porta o back vai rodar