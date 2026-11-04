import prisma from "../lib/prisma.js";
import type { Request, Response } from "express";

export default class LixeiraController {
    
    static async Create(req: Request, res: Response) {
        try {
            const { uuid_sensor, tipo, volume_max, nivel_cheio, ecoponto_id } = req.body;

            // verificação dos dados obrigatórios
            if (!uuid_sensor || !tipo || volume_max === undefined || nivel_cheio === undefined || !ecoponto_id) {
                return res.status(400).json({ erro: "Todos os campos da lixeira são obrigatórios." });
            }

            // inserir no banco de dados
            const novaLixeira = await prisma.lixeira.create({
                data: {
                    uuid_sensor,
                    tipo,
                    volume_max: Number(volume_max),
                    nivel_cheio: Number(nivel_cheio),
                    ecoponto_id: Number(ecoponto_id)
                }
            });

            return res.status(201).json({
                mensagem: "Lixeira cadastrada com sucesso!",
                lixeira: novaLixeira
            });
        } catch (error) {
            console.error("Erro ao criar lixeira:", error);
            return res.status(500).json({ erro: "Erro interno ao cadastrar lixeira." });
        }
    }

    // Método de busca de todas as lixeiras
    static async getLixeiras(req: Request, res: Response) {
        try {
            const lixeiras = await prisma.lixeira.findMany({
                include: { ecoponto: true }
            });

            return res.status(200).json(lixeiras);
        } catch (error) {
            console.error("Erro ao buscar lixeiras:", error);
            return res.status(500).json({ erro: "Erro interno ao buscar lixeiras." });
        }
    }
}