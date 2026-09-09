import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgot, reset } from "../api/Todo.jsx";

export default function ForgotPassword() {
  // ---------------------------------------------------------------------------
  // ESTADOS DA TELA DE RECUPERAÇÃO
  // ---------------------------------------------------------------------------
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  // Controla o fluxo visual em 2 Etapas:
  // step === 1: Pedir o e-mail do usuário
  // step === 2: Digitar o token e a nova senha
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ---------------------------------------------------------------------------
  // ETAPA 1: SOLICITAR TOKEN DE RECUPERAÇÃO
  // ---------------------------------------------------------------------------
  const handleRequestToken = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Chama o endpoint POST /forgotPassword do backend enviando { email }
      const response = await forgot({ email });

      // Como o backend devolve a chave 'resetToken' no JSON de teste local:
      if (response.data?.resetToken) {
        // Preenchemos o estado 'token' automaticamente para facilidade de testes
        setToken(response.data.resetToken);
        alert("Token gerado com sucesso no backend! Preencha a nova senha.");
      } else {
        alert(response.data?.message || "Solicitação enviada!");
      }

      // Avançamos o formulário para a Etapa 2
      setStep(2);
    } catch (error) {
      alert("Erro ao solicitar recuperação: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // ETAPA 2: REDEFINIR A SENHA DE FATO
  // ---------------------------------------------------------------------------
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Dispara a requisição POST /resetPassword enviando exatamente as chaves
      // { token, novaSenha } que o req.body do backend exige
      const response = await reset({ token, novaSenha });

      alert(response.data?.message || "Senha redefinida com sucesso!");
      
      // Redireciona para o login para o usuário entrar com as novas credenciais
      navigate("/login");
    } catch (error) {
      alert("Erro ao redefinir senha: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Recuperar Senha
      </h2>

      {/* RENDERIZAÇÃO CONDICIONAL POR ETAPA (step === 1) */}
      {step === 1 ? (
        <form onSubmit={handleRequestToken} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail Cadastrado</label>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors cursor-pointer mt-2"
          >
            {loading ? "Enviando..." : "Enviar Solicitação"}
          </button>
        </form>
      ) : (
        /* RENDERIZAÇÃO CONDICIONAL POR ETAPA (step === 2) */
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Token de Recuperação</label>
            <input
              type="text"
              required
              disabled={loading}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Token de recuperação"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-800 focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
            <input
              type="password"
              required
              disabled={loading}
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-800 focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors cursor-pointer mt-2"
          >
            {loading ? "Redefinindo..." : "Redefinir Senha"}
          </button>
        </form>
      )}

      {/* RODAPÉ DO FORMULÁRIO */}
      <div className="mt-5 flex justify-between items-center text-sm pt-2 border-t border-gray-100">
        <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
          Voltar ao Login
        </Link>
        {/* Permite ao usuário voltar para a Etapa 1 se preencheu o e-mail errado */}
        {step === 2 && (
          <button
            type="button"
            onClick={() => setStep(1)}
            className="text-gray-500 hover:text-gray-700 font-medium cursor-pointer"
          >
            Voltar etapa
          </button>
        )}
      </div>
    </div>
  );
}