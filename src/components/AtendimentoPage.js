import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  fetchAtendimentos,
  createAtendimento,
  updateAtendimento,
  deleteAtendimento,
  getAtendimentoById,
  fetchAtendimentosPage,
  fetchAtendimentosFilterPage,
} from "../services/AtendimentoService";

import { Button, Modal } from "react-bootstrap";
import Pagination from "./Pagination";
import { convertBackendDateToFrontend } from "./Utils";

function AtendimentoPage() {
  const [showModal, setShowModal] = useState(false);
  const [showModalProduto, setShowModalProduto] = useState(false);

  const [atendimento, setAtendimento] = useState({
    dataAtendimento: new Date(),
    houveInternacao: false,
    produtoAtendimento: [],
    tutor: { id: 0 },
    empregado: { id: 0 },
    animal: { id: 0 },
  });

  const [index, setIndex] = useState(-1);
  const [produtoAtendimento, setProdutoAtendimento] = useState({
    valor: 0,
    desconto: 0,
    produto: { id: 0 },
    quantidade: 1,
    data: new Date(),
    valorTotal: 0,
    quantidadeDias: 0,
    dataLiberacao: new Date(),
    dataInternacao: new Date(),
    tipoProduto: "MATERIAL",
  });

  const resetAtendimento = () => {
    setAtendimento({
      dataAtendimento: new Date(),
      houveInternacao: false,
      produtoAtendimento: [],
      tutor: { id: 0 },
      empregado: { id: 0 },
      animal: { id: 0 },
      tipoProduto: "MATERIAL",
    });
  };

  const resetProdutoAtendimento = () => {
    setIndex(-1);
    setProdutoAtendimento({
      valor: 0,
      desconto: 0,
      produto: { id: 0 },
      quantidade: 1,
      data: new Date(),
      valorTotal: 0,
      quantidadeDias: 0,
      dataLiberacao: new Date(),
      dataInternacao: new Date(),
    });
  };

  const [allAtendimento, setAllAtendimento] = useState([]);

  useEffect(() => {
    fetchAtendimentos()
      .then((response) => {
        setAllAtendimento(response.data.content);
        setTotalItens(response.data.totalElements);
      })
      .catch((error) => {
        console.log("Erro ao buscar atendimentos:", error);
      });
  }, []);

  const [showFilters, setShowFilters] = useState(false);

  const [totalItens, setTotalItens] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const indexOfLastAtendimento = currentPage * itemsPerPage;
  const indexOfFirstAtendimento = indexOfLastAtendimento - itemsPerPage;

  function limparFiltrosEspeciais() {}

  function handleOpenModal() {
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    resetAtendimento();
  }

  function handleCloseModalProduto() {
    setShowModalProduto(false);
    resetProdutoAtendimento();
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const name_ = name;
    if (name_.includes("-")) {
      const [name, id] = name_.split("-");
      setAtendimento((prevAtendimento) => ({
        ...prevAtendimento,
        [name]: {
          id: value,
        },
      }));
    } else {
      setAtendimento((prevAtendimento) => ({
        ...prevAtendimento,
        [name]: value,
      }));
    }
  };

  const handleInputProdutoChange = (event) => {
    const { name, value } = event.target;
    const name_ = name;
    if (name_.includes("-")) {
      const [name, id] = name_.split("-");
      setProdutoAtendimento((prevAtendimento) => ({
        ...prevAtendimento,
        [name]: {
          id: value,
        },
      }));
    } else {
      setProdutoAtendimento((prevAtendimento) => ({
        ...prevAtendimento,
        [name]: value,
      }));
    }
  };

  function handleFecthList() {
    fetchAtendimentos()
      .then((response) => {
        setAllAtendimento(response.data.content);
        setTotalItens(response.data.totalElements);
      })
      .catch((error) => {
        console.log("Erro ao buscar atendimentos:", error);
      });
  }

  function handleFecthEspecialFilterList() {
    fetchAtendimentos()
      .then((response) => {
        setAllAtendimento(response.data.content);
        setTotalItens(response.data.totalElements);
      })
      .catch((error) => {
        console.log("Erro ao buscar atendimentos:", error);
      });
  }

  const handleDelete = async (atendimentoId) => {
    try {
      const confirmation = window.confirm(
        "Tem certeza de que deseja excluir esto atendimento?"
      );
      if (confirmation) {
        await deleteAtendimento(atendimentoId);
        alert("Atendimento excluída com sucesso!");
        handleFecthList();
      }
    } catch (error) {
      console.error("Houve um erro ao excluir o atendimento:", error);
      alert(
        "Erro ao excluir o atendimento. Por favor, tente novamente mais tarde."
      );
    }
  };

  const handleUpdate = async (atendimentoToUpdate) => {
    try {
      await updateAtendimento(atendimentoToUpdate.id, atendimentoToUpdate);
      alert("Atendimento atualizada com sucesso!");
      handleFecthList();
      handleCloseModal();
      resetAtendimento();
    } catch (error) {
      console.error("Houve um erro ao atualizar o atendimento:", error);
      console.error(
        "Houve um erro ao atualizar o atendimento:",
        error.response?.data?.erro
      );
      if (error.response?.data?.erro) {
        alert(`Erro ao atualizar o atendimento. ${error.response.data.erro}.`);
      } else {
        alert(
          "Erro ao atualizar o atendimento. Por favor, tente novamente mais tarde."
        );
      }
    }
  };

  const handleEditAtendimento = async (atendimento) => {
    const response = await getAtendimentoById(atendimento.id);
    response.data.dataAtendimento = convertBackendDateToFrontend(
      response.data.dataAtendimento
    );
    setAtendimento(response.data);
    handleOpenModal();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await createAtendimento(atendimento);

      if (response.data) {
        alert("Atendimento criada com sucesso!");
        handleCloseModal();
        handleFecthList();
        resetAtendimento();
      } else {
        alert("Erro ao criar o atendimento.");
      }
    } catch (error) {
      console.error(
        "Houve um erro ao criar o atendimento:",
        error.response.data.erro
      );
      alert("Erro ao criar o atendimento: " + error.response.data.erro);
    }
  };

  const handleSubmitProduto = () => {
    const produtos = atendimento.produtoAtendimento;
    produtos.push(produtoAtendimento);
    setAtendimento((prevAtendimento) => ({
      ...prevAtendimento,
      produtoAtendimento: produtos,
    }));
    handleCloseModalProduto();
  };

  const handleUpdateProduto = () => {
    const produtos = atendimento.produtoAtendimento;
    const newProdutos = produtos.map((produto, indexProduto) => {
      if (indexProduto === index) {
        return produtoAtendimento;
      }
      return produto;
    });
    setAtendimento((prevAtendimento) => ({
      ...prevAtendimento,
      produtoAtendimento: newProdutos,
    }));
    handleCloseModalProduto();
  };

  const handleDeleteProduto = (produtoIndex) => {
    const produtos = atendimento.produtoAtendimento;
    const newProdutos = produtos.filter(
      (produtoAtend, indexProdutoAtend) => indexProdutoAtend !== produtoIndex
    );
    setAtendimento((prevAtendimento) => ({
      ...prevAtendimento,
      produtoAtendimento: newProdutos,
    }));
  };

  const handleEditProdutoAtendimento = (produto, indexProduto) => {
    setIndex(indexProduto);
    setProdutoAtendimento(produto);
    setShowModalProduto(true);
  };

  const fetchAtendimentosFromApi = async (page = 1) => {
    const response = await fetchAtendimentosPage(page - 1);
    setAllAtendimento(response.data.content);
    setTotalItens(response.data.totalElements);
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>Listagem de Atendimentos</h2>
        <Button className="btn btn-primary btn-lg" onClick={handleOpenModal}>
          Cadastrar Atendimento
        </Button>
      </div>

      <div className="d-flex mb-3">
        {/* Dropdown para filtros especiais */}
        <div className="dropdown me-2">
          <button
            className="btn btn-secondary btn-lg dropdown-toggle"
            type="button"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filtros Especiais
          </button>
          <div
            className={`dropdown-menu ${showFilters ? "show" : ""}`}
            style={{ width: "300px" }}
          >
            {/* Filtro por data */}

            <div className="p-2 d-flex justify-content-end">
              <Button
                className="btn btn-default btn-sm me-2"
                onClick={() => limparFiltrosEspeciais()}
              >
                Limpar
              </Button>
              <Button
                className="btn btn-primary btn-sm"
                onClick={() => handleFecthEspecialFilterList()}
              >
                Buscar
              </Button>
            </div>
          </div>
        </div>

        <div className="input-group">
          <button
            className="btn btn-outline-secondary"
            type="button"
            id="button-addon2"
            onClick={() => handleFecthList()}
          >
            Buscar
          </button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Tutor</th>
            <th>Empregado</th>
            <th>Houve internação</th>
            <th>Data Atendimento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {allAtendimento.map((atendimento) => (
            <tr key={atendimento.id}>
              <td>{atendimento.id}</td>
              <td>{atendimento.tutor?.nome}</td>
              <td>{atendimento.empregado?.nome}</td>
              <td>{atendimento.houveInternacao}</td>
              <td>
                {new Date(atendimento.dataAtendimento).toLocaleDateString()}
              </td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEditAtendimento(atendimento)}
                >
                  Alterar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(atendimento.id)}
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-end">
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={totalItens}
          currentPage={currentPage}
          onChangePage={(page) => fetchAtendimentosFromApi(page)}
        />
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar Atendimento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label>Tutor:</label>
            <input
              type="number"
              className="form-control"
              name="tutor-id"
              value={atendimento.tutor?.id}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Animal:</label>
            <input
              type="number"
              className="form-control"
              name="animal-id"
              value={atendimento.animal?.id}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Empregado:</label>
            <input
              type="number"
              className="form-control"
              name="empregado-id"
              value={atendimento.empregado?.id}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Data atendimento:</label>
            <input
              type="date"
              className="form-control"
              name="dataAtendimento"
              value={atendimento.dataAtendimento}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Houve internação:</label>
            <input
              type="checkbox"
              className="form-check-input"
              name="houveInternacao"
              checked={atendimento.houveInternacao}
              onChange={(e) =>
                setAtendimento((prev) => ({
                  ...prev,
                  houveInternacao: e.target.checked,
                }))
              }
            />
            <br />
            <br />
          </div>
          <h5>Produtos</h5>
          <table className="table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descrição</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {atendimento.produtoAtendimento.map((produtoAtend, index) => (
                <tr key={produtoAtend.id}>
                  <td>{produtoAtend.produto.id}</td>
                  <td>{produtoAtend.produto.descricao}</td>
                  <td>{produtoAtend.tipoProduto}</td>
                  <td>{produtoAtend.valor}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() =>
                        handleEditProdutoAtendimento(produtoAtend, index)
                      }
                    >
                      Alterar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteProduto(index)}
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalProduto(true)}>
            Adicionar Produto
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fechar
          </Button>
          <Button
            variant="primary"
            onClick={(event) =>
              atendimento.id ? handleUpdate(atendimento) : handleSubmit(event)
            }
          >
            {atendimento.id ? "Atualizar" : "Salvar"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModalProduto} onHide={() => setShowModalProduto(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label>Tipo produto</label>
            <select
              className="form-control"
              name="tipoProduto"
              value={produtoAtendimento.tipoProduto}
              onChange={handleInputProdutoChange}
            >
              <option value="MATERIAL">Material</option>
              <option value="REMEDIO">Remédio</option>
              <option value="ATENDIMENTO">Atendimento</option>
              <option value="PROCEDIMENTO">Procedimento</option>
            </select>
          </div>
          <div>
            <label>Produto:</label>
            <input
              type="number"
              className="form-control"
              name="produto-id"
              value={produtoAtendimento.produto?.id}
              onChange={handleInputProdutoChange}
            />
          </div>
          {produtoAtendimento.tipoProduto === "ATENDIMENTO" ? (
            <div>
              <label>Data liberação:</label>
              <input
                type="date"
                className="form-control"
                name="dataLiberacao"
                value={produtoAtendimento.dataLiberacao}
                onChange={handleInputProdutoChange}
              />
            </div>
          ) : null}
          {produtoAtendimento.tipoProduto === "ATENDIMENTO" ? (
            <div>
              <label>Data internação:</label>
              <input
                type="date"
                className="form-control"
                name="dataInternacao"
                value={produtoAtendimento.dataInternacao}
                onChange={handleInputProdutoChange}
              />
            </div>
          ) : null}
          {produtoAtendimento.tipoProduto === "PROCEDIMENTO" ? (
            <div>
              <label>Data procedimento:</label>
              <input
                type="date"
                className="form-control"
                name="data"
                value={produtoAtendimento.data}
                onChange={handleInputProdutoChange}
              />
            </div>
          ) : null}
          {produtoAtendimento.tipoProduto === "MATERIAL" ||
          produtoAtendimento.tipoProduto === "REMEDIO" ? (
            <div>
              <label>Quantidade:</label>
              <input
                type="number"
                className="form-control"
                name="quantidade"
                value={produtoAtendimento.quantidade}
                onChange={handleInputProdutoChange}
              />
            </div>
          ) : null}
          <div>
            <label>Valor:</label>
            <input
              type="number"
              className="form-control"
              name="valor"
              value={produtoAtendimento.valor}
              onChange={handleInputProdutoChange}
            />
          </div>
          <div>
            <label>Desconto:</label>
            <input
              type="number"
              className="form-control"
              name="desconto"
              value={produtoAtendimento.desconto}
              onChange={handleInputProdutoChange}
            />
          </div>
          <div>
            <label>Valor total:</label>
            <input
              type="number"
              className="form-control"
              name="valorTotal"
              value={produtoAtendimento.valorTotal}
              onChange={handleInputProdutoChange}
              disabled
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModalProduto(false)}
          >
            Fechar
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              index !== -1 ? handleUpdateProduto() : handleSubmitProduto()
            }
          >
            {index !== -1 ? "Atualizar" : "Salvar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AtendimentoPage;
