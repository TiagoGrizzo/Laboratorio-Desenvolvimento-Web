import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/Todo.jsx";

export default function Register() {
  // ---------------------------------------------------------------------------
  // ESTADOS DO FORMULÁRIO (Controlled Components)
  // ---------------------------------------------------------------------------
  // Cada campo de input no HTML está conectado a um destes estados
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  
  // Controla o tempo de resposta da API para desativar os botões (evita cliques múltiplos)
  const [loading, setLoading] = useState(false);
  
  // Armazena a mensagem de erro que vem do backend para exibir na tela
  const [errorMsg, setErrorMsg] = useState("");
  
  // Hook para redirecionar o usuário após o cadastro
  const navigate = useNavigate();

  // ---------------------------------------------------------------------------
  // MANIPULADOR DE ENVIO DO FORMULÁRIO
  // ---------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    // Cancela o recarregamento padrão da página que o evento do formulário HTML faz
    e.preventDefault();
    
    // Ativa o estado de carregamento e limpa erros antigos
    setLoading(true);
    setErrorMsg("");

    try {
      // Dispara a requisição POST /createUsuario passando o objeto no formato esperado pela API
      await register({ nome, email, senha });
      
      // Se não der erro no await, o cadastro foi um sucesso no MongoDB
      alert("Conta criada com sucesso! Faça login para continuar.");
      
      // Manda o novo usuário para a tela de login
      navigate("/login");
    } catch (error) {
      // Se o backend retornar status 400, 402 ou 500, o código vem para o catch.
      // Tentamos pegar a mensagem customizada do servidor (error.response.data.message).
      setErrorMsg(
        error.response?.data?.message || "Erro ao realizar cadastro. Tente novamente."
      );
    } finally {
      // Desativa o indicador de carregamento permitindo novas ações
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Criar uma Conta
      </h2>

      {/* RENDERIZAÇÃO CONDICIONAL DE ERRO: Só aparece se errorMsg não estiver vazia */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* INPUT: NOME */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            type="text"
            required // Validação HTML5 simples
            disabled={loading} // Bloqueia o campo durante o envio
            value={nome} // O valor exibido é o estado do React
            onChange={(e) => setNome(e.target.value)} // Atualiza o estado a cada caractere digitado
            placeholder="Seu nome completo"
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-800 focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-gray-100"
          />
        </div>

        {/* INPUT: EMAIL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <input
            type="email"
            required
            disabled={loading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-800 focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-gray-100"
          />
        </div>

        {/* INPUT: SENHA */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input
            type="password"
            required
            disabled={loading}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-800 focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-gray-100"
          />
        </div>

        {/* BOTÃO SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center cursor-pointer mt-2"
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>

      {/* LINK DE NAVEGAÇÃO INTERNA */}
      <div className="mt-6 text-center text-sm text-gray-600 border-t border-gray-100 pt-4">
        Já tem uma conta?{" "}
        <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
          Entrar
        </Link>
      </div>
    </div>
  );
}