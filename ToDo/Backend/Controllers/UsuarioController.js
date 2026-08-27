import Usuario from "../Models/Usuario.js";
import {hash, verify} from "@node-rs/argon2";
import jwt from "jsonwebtokem";
import cookieparser from "cookie-parser";
import {Types} from "mongoose"
const JWT_EXPIRATION_MS = 24 * 60 * 60 * 1000;
const   JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta_muito_forte";
export default class UsuarioController{
    static async Create(req, res){
        const{nome, email, senha} = req.body;
        if(!nome || !email || !senha )
        {
            return res.status(422).json({message: "Todos os dados são obrigatórios"});
        }
        try {
            const hashPassword = await hash(senha);
            const usuario = new Usuario({
                nome,
                email,
                senha:hashPassword,

            });
            const novoUsuario = await usuario.save();
            res.status(200).json({message:"Usuário inserido com sucesso", novoUsuario});
            return;
        } catch (error) {
            return res.status(500).json({message:"Problema ao inserir um usuário", error});
        }
    }//fim create

        static async Login(req, res){
            const{email, senha} = req.body
            if(!email || !senha)
            {
                return res.status(422).json({message: "Credenciais Inválidas"});
            }
            try
            {
            const senhaValida = await verify(usuario.senha, senha);
            if(!senhaValida)
            {
                return res.status(400).json({message: "Credenciais Inválidas"});
            }
            const tokenPayload = {
                id: usuario._Id,
                nome: usuario._Nome,
                email: usuario._Email
            };
            const token = jwt.sign(tokenPayload, JWT_SECRET, {expiresIn: "1h"});
            res.cookie("token", token, {
                httpOnly:true,
                secure:false,
                sameSite:"lax", //tornar true em produção
                maxAge: JWT_EXPIRATION_MS || 3600000 //1H
            });
            return res.status(200).json({message:"Login efetuado com sucesso"},
                usuario={id:usuario.id, nome:usuario.nome, email: usuario.email}, token
            )
        }
        catch (error)
        {
            return res.status(500).json({message: "Problema ao inserir um Usuario", error});
        }

    }
}