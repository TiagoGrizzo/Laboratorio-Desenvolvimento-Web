import Tarefa from "../Models/Tarefa.js";
import {Types} from "mongoose";
export default class TarefaController{
    static async Create(req, res){ ///Método Create
        const{titulo, descricao, dataLimite, situacao} = req.body 
        /*aqui é bom usarmos o mesmo nome que usamos no Schema
        porque lá no try podemos só colocar o mesmo nome também, sem ter que atribuir um nome diferente caso tivessemos colocado aqui*/
        if(!titulo || !descricao || !dataLimite || !situacao) //validação para ver se foram preenchidos, porque são requeridos
        {
            return res.status(422).json({message: "Todos os dados são obrigatórios."});
        }
        try {
            const tarefa = new Tarefa({
                titulo,
                descricao,
                dataLimite,
                situacao
            });
            const novaTarefa = await tarefa.save();
            res.status(200).json({message: "Tarefa inserida com sucesso", novaTarefa} //Esse e o de baixo faz a mesma coisa.      
            );
            return;
        } catch (error) {
            return res.status(500).json({message: "Problema ao inserir uma tarefa", error}); //Outra forma de fazer, aqui já faz os dois juntos mensagem e return de uma vez só.
        }
    }//fim do create

    static async getAll(req, res){ //Pegar todas as tarefas.
        try{
            const tarefas = await Tarefa.find();
            return res.status(200).json({message:"Buscar tarefas com sucesso", tarefas});
        }
        catch (error) 
        {
            return res.status(500).json({message:"Erro ao buscar todas as tarefas", error});
        }

    }//Fim do getAll
}//Fim da classe