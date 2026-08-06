import mongoose from "../Db/conn.js"; //puxa tudo o que fizemos na main do conn.js, no caso, a conexão com o db
const {Schema} = mongoose;
const tarefaSchema = new Schema({
    titulo:{
        type: String,
        required: true,
    },
    descricao:{
        type: String,
        required: true,
    },
    dataLimite:{
        type: Date,
        required: true,
    },
    situacao:{
        type: String,
        required: true,
    }
},{timestamps:true});
const Tarefa = mongoose.model('Tarefa', tarefaSchema);
export default Tarefa;