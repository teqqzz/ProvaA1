  import { useState, useEffect } from "react";
  import { Tarefa } from "../../models/Tarefa";
  import { Link } from "react-router-dom";	
  import axios from "axios";

  function TarefaListar() {
    const [tarefa, setTarefas] = useState<Tarefa[]>([]);

    useEffect(() => {
      carregarTarefas();
    }, []);

    function carregarTarefas() {
      axios.get<Tarefa[]>("http://localhost:5000/api/tarefas/listar").then((resposta) => {
        setTarefas(resposta.data);
      }).catch((erro) => {
        console.log("Erro: " + erro);
      });
    }

    return (
      <div>
        <h1>Lista de Tarefas</h1>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "8px" }}>TarefaId</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Titulo</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Descricao</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Status</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Categoria</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Criado Em</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Alterar</th>
            </tr>
          </thead>
          <tbody>
            {tarefa.map((tarefa) => (
              <tr key={tarefa.tarefaId}>
                <td style={{ border: "1px solid black", padding: "8px" }}>{tarefa.tarefaId}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{tarefa.titulo}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{tarefa.descricao}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{tarefa.status}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{tarefa.categoriaId} - {tarefa.nome}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{tarefa.criadoEm}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  <button type="button"><Link to={`/tarefa/alterar/${tarefa.tarefaId!}`}>Alterar</Link></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  export default TarefaListar;