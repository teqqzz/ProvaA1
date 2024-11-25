import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function TarefaAlterar() {
  const { tarefaId } = useParams<{ tarefaId: string }>();
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState("Não Iniciada");
  const [categoriaId, setCategoriaId] = useState("");
  const [mensagem, setMensagem] = useState(""); 

  useEffect(() => {
    if (tarefaId) {
      axios
        .get(`http://localhost:5000/api/tarefas/buscar/${tarefaId}`)
        .then((response) => {
          const tarefa = response.data;
          setTitulo(tarefa.titulo);
          setDescricao(tarefa.descricao);
          setCategoriaId(tarefa.categoriaId);
          setStatus(tarefa.status); 
        })
        .catch((error) => {
          console.error("Erro ao buscar tarefa", error);
        });
    }
  }, [tarefaId]);

  function editarTarefa(e: any) {
    e.preventDefault();

    const tarefa = {
      titulo: titulo,
      descricao: descricao,
      status: status, 
      categoriaId: categoriaId,
    };

    axios
      .patch(`http://localhost:5000/api/tarefas/alterar/${tarefaId}`, tarefa)
      .then((response) => {
        setMensagem("Tarefa alterada com sucesso!"); 
        setTimeout(() => {
          setMensagem(""); 
          navigate("/tarefas"); 
        }, 3000);
      })
      .catch((error) => {
        console.error("Erro ao editar tarefa", error);
      });
  }

  return (
    <div>
      <h1>Editar Tarefa</h1>
      {mensagem && <div style={{ color: "green", marginBottom: "10px" }}>{mensagem}</div>}

      <form onSubmit={editarTarefa}>
        <div>
          <label>Título:</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Descrição:</label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Não Iniciada">Não Iniciada</option>
            <option value="Concluída">Concluída</option>
          </select>
        </div>
        <div>
          <label>CategoriaId:</label>
          <input
            type="text"
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
}

export default TarefaAlterar;