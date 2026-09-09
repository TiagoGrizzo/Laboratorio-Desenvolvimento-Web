import React, { useState, useEffect } from "react";
// Importamos os componentes do React Router para controlar a navegação entre telas sem recarregar a página
import { Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";

// Importação das telas da aplicação
import LandingPage from "./Pages/LandingPage";
import TodoList from "./Pages/TodoList";
import Login from "./Pages/Login";
import TodoForm from "./Pages/TodoForm";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";

// Importação de imagem e serviços de API
import logoTodo from "./assets/logo-todo.png";
import { logout, getProfile } from "./api/Todo.jsx";

export default function App() {
  // ---------------------------------------------------------------------------
  // ESTADOS DA APLICAÇÃO (State Management)
  // ---------------------------------------------------------------------------

  // Guardamos se o usuário está autenticado (true) ou não (false)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Controlamos o estado de carregamento inicial para evitar exibir a tela errada antes de checar a sessão
  const [loading, setLoading] = useState(true);

  // Hook do React Router para mudar de página via código (ex: redirecionar após logout)
  const navigate = useNavigate();

  // ---------------------------------------------------------------------------
  // CICLO DE VIDA: VERIFICAÇÃO DE SESSÃO (useEffect)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // Função assíncrona que vai até o backend checar se o cookie JWT ainda é válido
    const checkUserSession = async () => {
      try {
        // Dispara GET /me para a API (envia os cookies automaticamente devido ao withCredentials: true)
        const response = await getProfile();

        // Se o servidor responder 200 OK, a sessão existe e o usuário está autenticado
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Se der erro (ex: 401 Unauthorized), significa que o cookie expirou ou não existe
        console.log("Sessão não encontrada ou expirada:", error);
        setIsAuthenticated(false);
      } finally {
        // O bloco 'finally' SEMPRE roda (dando erro ou sucesso). Desativamos a tela de carregamento.
        setLoading(false);
      }
    };

    // Executamos a checagem assim que o componente é montado na tela
    checkUserSession();
  }, []); // Array de dependências vazio [] garante que só rodará 1 vez ao abrir a aplicação

  // ---------------------------------------------------------------------------
  // FUNÇÃO DE LOGOUT
  // ---------------------------------------------------------------------------
  const handleLogout = async () => {
    try {
      // Pede para o backend limpar o cookie HTTP-Only via res.clearCookie('token')
      await logout();
    } catch (error) {
      console.error("Erro ao fazer logout no servidor:", error);
    } finally {
      // Independente do backend, atualizamos o estado do React para deslogar a interface
      setIsAuthenticated(false);
      // Redirecionamos o usuário de volta para a Landing Page principal
      navigate("/");
    }
  };

  // ---------------------------------------------------------------------------
  // TELA DE CARREGAMENTO (SPLASH SCREEN)
  // ---------------------------------------------------------------------------
  // Enquanto o useEffect estiver checando o cookie, exibimos apenas esta mensagem.
  // Isso evita que a tela 'pisque' redirecionando o usuário sem necessidade.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium">Carregando aplicação...</p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDERIZAÇÃO DE ROTAS E LAYOUT
  // ---------------------------------------------------------------------------
  return (
    <Routes>
      {/* Rota Raiz (/): Se logado, manda para /todos. Se não, exibe a LandingPage pública */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/todos" replace /> : <LandingPage />
        }
      />

      {/* Rota Coringa (/*): Empacota o layout com Cabeçalho e sub-rotas internas */}
      <Route
        path="/*"
        element={
          <div className="min-h-screen bg-gray-50 p-6">
            {/* CABEÇALHO DA APLICAÇÃO */}
            <header className="max-w-3xl mx-auto mb-8">
              <nav className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">
                  {/* Se clicar na logo e estiver logado vai pra /todos, senão vai pra / */}
                  <Link to={isAuthenticated ? "/todos" : "/"}>
                    <img
                      src={logoTodo}
                      alt="Logo ToDo"
                      className="h-20 w-auto"
                    />
                  </Link>
                </h1>

                {/* Opções exibidas apenas quando o usuário está autenticado */}
                <div className="flex items-center gap-4">
                  {isAuthenticated && (
                    <>
                      <Link
                        to="/todos"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900"
                      >
                        Tarefas
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors cursor-pointer"
                      >
                        Sair
                      </button>
                    </>
                  )}
                </div>
              </nav>
            </header>

            {/* CONTEÚDO DINÂMICO DAS SUB-ROTAS */}
            <main className="max-w-3xl mx-auto">
              <Routes>
                {/* ROTAS PROTEGIDAS: Exigem isAuthenticated === true. Se false, força ir para /login */}
                <Route
                  path="todos"
                  element={
                    isAuthenticated ? (
                      <TodoList />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
                <Route
                  path="new"
                  element={
                    isAuthenticated ? (
                      <TodoForm />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />

                {/* ROTAS PÚBLICAS / AUTENTICAÇÃO: Se o usuário já estiver logado, não precisa ver telas de login/cadastro */}
                <Route
                  path="login"
                  element={
                    isAuthenticated ? (
                      <Navigate to="/todos" replace />
                    ) : (
                      <Login
                        onLoginSuccess={() => {
                          // Callback chamado após fazer login com sucesso na tela Login.jsx
                          setIsAuthenticated(true);
                          navigate("/todos");
                        }}
                      />
                    )
                  }
                />
                <Route
                  path="register"
                  element={
                    isAuthenticated ? (
                      <Navigate to="/todos" replace />
                    ) : (
                      <Register />
                    )
                  }
                />
                <Route
                  path="forgot"
                  element={
                    isAuthenticated ? (
                      <Navigate to="/todos" replace />
                    ) : (
                      <ForgotPassword />
                    )
                  }
                />
              </Routes>
            </main>
          </div>
        }
      />
    </Routes>
  );
}