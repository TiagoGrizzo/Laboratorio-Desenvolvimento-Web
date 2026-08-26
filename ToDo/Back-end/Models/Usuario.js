import mongoose from "../Db/conn.js"; //puxa tudo o que fizemos na main do conn.js, no caso, a conexão com o db
const {Schema} = mongoose;
const usuarioSchema = new Schema({
    nome:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true, //Retir espaços que o usuario pode ter batido sem querer
        lowercase: true, //escrever tanto maiúsuclo quanto minúsculo da certo
    },
    senha:{
        type: String,
        required: true,
        select: false, //qunado vc procura um usuario ele não traz a senha na consulta
    },
    resetToken:{
        type: String,
        required: true,
        select: false,
    },
    resetTokenExpiry:{
        type: Date,
        select: false,
    }

},{timestamps:true});
const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario;