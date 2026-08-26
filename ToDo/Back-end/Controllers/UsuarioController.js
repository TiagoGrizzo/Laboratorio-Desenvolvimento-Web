import Usuario from "../Models/Usuario.js";
//import argon2 from "argon2";
import {Types} from "mongoose";
export default class UsuarioController{
    static async Create(req, res){ ///Método Create
        const{nome, email, senha} = req.body 
        /*aqui é bom usarmos o mesmo nome que usamos no Schema
        porque lá no try podemos só colocar o mesmo nome também, sem ter que atribuir um nome diferente caso tivessemos colocado aqui*/
        if(!nome || !email || !senha) //validação para ver se foram preenchidos, porque são requeridos
        {
            return res.status(422).json({message: "Todos os dados são obrigatórios."});
        }
        try {
            const hashPassword = await argon2.hash(senha);
            const tarefa = new Usuario({
                nome,
                email,
                senha,
                //senha:hashPassword
            });
            const novoUsuario = await usuario.save();
            res.status(200).json({message: "Usuario inserido com sucesso", novoUsuario} //Esse e o de baixo faz a mesma coisa.      
            );
            return;
        } catch (error) {
            return res.status(500).json({message: "Problema ao inserir um usuario", error}); //Outra forma de fazer, aqui já faz os dois juntos mensagem e return de uma vez só.
        }
    }//fim do create
}