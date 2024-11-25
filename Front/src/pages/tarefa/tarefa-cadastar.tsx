import { useState, useEffect } from "react";
import axios from "axios";

function TarefaCadastrar() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [categorias, setCategorias] = useState([]); 
  const [mensagem, setMensagem] = useState(""); 

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categoria/listar") 
      .then((response) => {
        setCategorias(response.data); 
      })
      .catch((error) => {
        console.error("Erro ao carregar categorias:", error);
      });
  }, []);

  function cadastrarTarefa(e: any) {
    e.preventDefault();
    const tarefa = {
      titulo: titulo,
      descricao: descricao,
      status: "Não iniciada",
      categoriaId: categoriaId,
    };

    axios
      .post("http://localhost:5000/tarefas/cadastrar", tarefa, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        setMensagem("Tarefa cadastrada com sucesso!");
        setTitulo("");
        setDescricao("");
        setCategoriaId("");
      })
      .catch((error) => {
        setMensagem("Erro ao cadastrar tarefa: " + error.response?.data);
        console.error("Erro ao cadastrar tarefa:", error);
      });
  }

  return (
    <div>
      <h1>Cadastrar Tarefa</h1>
      <form onSubmit={cadastrarTarefa}>
        <div>
          <label>Título:</label>
          <input
            type="text"
            placeholder="Digite o título da tarefa"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Descrição:</label>
          <input
            type="text"
            placeholder="Digite a descrição da tarefa"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Categoria:</label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            required
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map((categoria: any) => (
              <option key={categoria.categoriaId} value={categoria.categoriaId}>
                {categoria.categoriaId} - {categoria.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button type="submit">Cadastrar</button>
        </div>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}

export default TarefaCadastrar;