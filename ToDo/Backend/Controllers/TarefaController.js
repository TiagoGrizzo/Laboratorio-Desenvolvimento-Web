import Tarefa from "../Models/Tarefa.js";
import {Types} from "mongoose";
export default class TarefaController{
    static async Create(req, res){
        const{titulo, descricao, dataLimite, situacao, participam} = req.body;
        const usuarioLogado = req.user.id;
        if(!titulo || !descricao || !dataLimite || !situacao)
        {
            return res.status(422).json({message: "Todos os dados são obrigatórios"});
        }
        try {
            const tarefa = new Tarefa({
                titulo,
                descricao,
                dataLimite,
                situacao,
                criadoPor: usuarioLogado,
                participam: Array.isArray(participam)? 
                participam : (participam ? [participam] : [])

            });
            const novaTarefa = await tarefa.save();
            const tarefaPopulada = await Tarefa.findById(
                novaTarefa._Id)
                .populate("criadoPor", "nome email")
                .populate("participam", "nome email");
            res.status(200).json({message:"Tarefa inserida com sucesso", novaTarefa:tarefaPopulada});
            return;
        } catch (error) {
            return res.status(500).json({message:"Problema ao inserir uma tarefa", error});
        }
    }//fim create
    static async getAll(req, res){
        const usuarioLogado = req.user.id;
        try {
            const tarefas = await Tarefa.find({
                    $or:[
                        {criadoPor:usuarioLogado},
                        {participam: usuarioLogado}
                    ]
                })
                .populate("criadoPor", "nome")
                .populate("participam", "nome")
                .sort({ createdAt: -1 });
            
            return res.status(200).json({message:"Buscar tarefas com sucesso", tarefas});
        } catch (error) {
            return res.status(500).json({message:"Erro ao buscar todas tarefas", error});
        }

    }//fim getAll


    //Método para dar o update na tarefa
    static async updateSituacao(req, res) {
    const { id } = req.params;
    const { situacao } = req.body;

    //validação para ver se a situação foi informada, se estiver vazia ele interrompe a execução
    if (!situacao) {
      return res.status(422).json({ message: "A situação é obrigatória" });
    }

    try {
      const tarefaAtualizada = await Tarefa.findByIdAndUpdate(
        id,
        { situacao },
        { new: true }
      );

      //tratamento para caso a tarefa não seja encontrada. Caso o ID não bater com nenhuma tarefa do banco
      if (!tarefaAtualizada) {
        return res.status(404).json({ message: "Tarefa não encontrada" });
      }

      //se a tarefa for encontrada e atualizada ele devolve a mensagem avisando que deu certo
      //se houver algum erro interno, ele devolve a mensagem de erro
      return res.status(200).json({ message: "Situação atualizada com sucesso", tarefa: tarefaAtualizada });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao atualizar situação da tarefa", error });
    }
  }
}