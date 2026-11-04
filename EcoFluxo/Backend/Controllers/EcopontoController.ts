import { error } from "node:console";
import prisma from "../lib/prisma.js";
import type {Request, Response} from "express";
export default class EcopontoController{
    static async Create(req:Request,res:Response){
        try
         {
            const {nome, latitude, longitude, descricao, cep, logradouro, numero, bairro, cidade, uf, nota} = req.body;
            //verificação dos dados obrigatórios
            if(!nome || !latitude || !longitude)
            {
                return res.status(400).json({erro: "Nome, latitude e longetude são obrigatorios."});
            }

            const novoEcoponto = await prisma.ecoponto.create({
                data:{nome,
                     latitude,
                     longitude,
                     descricao, 
                     cep, 
                     logradouro, 
                     numero, 
                     bairro, 
                     cidade, 
                     uf, 
                     nota
                    }
            });

            return res.status(201).json({
                mensagem: "Ecoponto cadastrado com sucesso!",
                ecoponto: novoEcoponto
            });

            //inserir no banco de dados
        } catch (error) {
            console.error("Erro ao criar ecoponto:", error);
            return res.status(500).json({erro: "Erro interno ao cadastrar o ecoponto"});
        }
        
    }
    static async getEcopontos(req:Request,res:Response){
        try {
            const ecopontos = await prisma.ecoponto.findMany({
                include: {lixeiras: true}
            });

            return res.status(200).json(ecopontos)
        } catch (error) {
            console.error("Erro ao buscar ecopontos");
            return res.status(500).json({erro: "Erro interno ao buscar ecopontos."})
        }
    }
}
