import ChatController from "../Controllers/ChatController";
export default function registerChatSocket(io, socket){
    //entrar em uma sala especifica (de uma tarefa)
    socket.on("Join_task", (tarefaId) => {
        socket.join(`tarefa_${tarefaId}`),
        console.log(`socket ${socket.id} entrou no chat da tarefa_${tarefaId}`);
    });
    //envir a mensagem
    socket.on("send_message", (data) => {
        ChatController.sendSaveMessage(io, socket, data);
    });

    //sair do chat
    socket.on("leave_task", (tarefaId)=> {
        socket.leave(`tarefa_${tarefaId}`);
    });
}