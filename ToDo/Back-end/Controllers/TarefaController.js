import Tarefa from "../Models/Tarefa.js";
import {Types} from "mongoose";
export default class TarefaController{
    static async Create(req, res){
        const{titulo, descricao, dataLimite, situacao} = req.body 
        /*aqui é bom usarmos o mesmo nome que usamos no Schema
        porque lá no try podemos só colocar o mesmo nome também, sem ter que atribuir um nome difrente caso tivessemos colocado aqui*/
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
            res.status(200).json({message: "Tarefa inserida com sucesso", novaTarefa}
            );
        } catch (error) {
            return 
        }
    }//fim do create
}