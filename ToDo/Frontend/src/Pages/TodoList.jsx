import React, { useState, useEffect } from "react";
import { getTodos, updateTodoStatus } from "../api/Todo.jsx"; //Importando o updateTodoStatus que criamos agora
import TodoItem from "../Components/TodoItem.jsx";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts"; //Import do apexchart

export default function TodoList({ usuarioLogado }) { 
  //estados do componente
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //busca de tarefas
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await getTodos();
      setTodos(res.data.tarefas || []);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Erro ao carregar tarefas";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // envia a nova situação para a api e chama o fetchTodos() para recarregar a lista e o grafico
  const handleStatusChange = async (id, novaSituacao) => {
    try {
      await updateTodoStatus(id, novaSituacao);
      fetchTodos();
    } catch (err) {
      alert("Erro ao alterar situação: " + (err.response?.data?.message || err.message));
    }
  };

  // conta quantas tarefas estao em cada situação
  const pendentes = todos.filter((t) => {
    const s = (t.situacao || "").toUpperCase();
    return s === "PENDENTE" || s === "";
  }).length;

  const finalizadas = todos.filter((t) => (t.situacao || "").toUpperCase() === "FINALIZADA").length;
  const canceladas = todos.filter((t) => (t.situacao || "").toUpperCase() === "CANCELADA").length;

  const chartOptions = {
    chart: { type: "donut" },
    labels: ["Pendentes", "Finalizadas", "Canceladas"],
    colors: ["#EAB308", "#22C55E", "#EF4444"],
    legend: { position: "bottom" },
  };

  const chartSeries = [pendentes, finalizadas, canceladas];

  return (
    <div className="space-y-6">
      {/*exibe o gráfico Donut apenas quando há tarefas carregadas na tela */}
      {!loading && !error && todos.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
            Situação das Tarefas
          </h3>
          <div className="flex justify-center">
            <Chart options={chartOptions} series={chartSeries} type="donut" width="360" />
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Minhas Tarefas</h2>
            <p className="text-sm text-gray-500">Gerencie suas atividades diárias</p>
          </div>
          <Link
            to="/new"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <span>+</span> Nova Tarefa
          </Link>
        </div>

        {loading && (
          <div className="text-center py-8 text-gray-500 font-medium">
            Carregando tarefas...
          </div>
        )}

        {error && !loading && (
          <div className="p-4 mb-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* renderizando os itens com os botões de ação */}
        {!loading && !error && (
          <div className="space-y-3">
            {todos?.length === 0 ? (
              <p className="text-center py-8 text-gray-500">
                Nenhuma tarefa encontrada!
              </p>
            ) : (
              todos?.map((todo) => (
                <div key={todo._id || todo.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg bg-gray-50 gap-4">
                  <div className="flex-1">
                    <TodoItem todo={todo} usuarioLogado={usuarioLogado} />
                  </div>

                  {/*botões para acionar a troca de situação */}
                  {/*exibe o botão Finalizar (se não estiver finalizada) e Cancelar (se não estiver cancelada) */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    {(todo.situacao || "").toUpperCase() !== "FINALIZADA" && (
                      <button
                        onClick={() => handleStatusChange(todo._id || todo.id, "Finalizada")}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors"
                      >
                        Finalizar
                      </button>
                    )}
                    {(todo.situacao || "").toUpperCase() !== "CANCELADA" && (
                      <button
                        onClick={() => handleStatusChange(todo._id || todo.id, "Cancelada")}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}