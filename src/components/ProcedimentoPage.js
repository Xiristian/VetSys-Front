import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchProcedimentos, createProcedimento, updateProcedimento, deleteProcedimento, getProcedimentoById, fetchProcedimentosPage, fetchProcedimentosFilterPage } from '../services/ProcedimentoService';

import { Button, Modal } from 'react-bootstrap';
import Pagination from './Pagination';

function ProcedimentoPage() {
    const [showModal, setShowModal] = useState(false);

    const [procedimento, setProcedimento] = useState({
        descricao: '',
        valor: '',
        observacao: '',
        tipo: 'CONSULTA',
    });

    const resetProcedimento = () => {
        setProcedimento({
            descricao: "",
            observacao: "",
            valor: null,
            tipo: 'CONSULTA',
        });
    }

    const [procedimentos, setProcedimentos] = useState([]);

    useEffect(() => {
        fetchProcedimentos()
            .then(response => {
                setProcedimentos(response.data.content);
                setTotalItens(response.data.totalElements);
            })
            .catch(error => {
                console.log('Erro ao buscar procedimentos:', error);
            });
    }, []);

    const [descriptionFilter, setDescriptionFilter] = useState('');
    const [tipoFilter, setTipoFilter] = useState('');

    const [showFilters, setShowFilters] = useState(false);

    const [totalItens, setTotalItens] = useState(1);
    const [itemsPerPage] = useState(10);

    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastProcedimento = currentPage * itemsPerPage;
    const indexOfFirstProcedimento = indexOfLastProcedimento - itemsPerPage;

    function limparFiltrosEspeciais() {
        setTipoFilter('');
    }

    function handleOpenModal() {
        setShowModal(true);
    }

    function handleCloseModal() {
        setShowModal(false);
        resetProcedimento();
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProcedimento(prevProcedimento => ({
            ...prevProcedimento,
            [name]: value
        }));
    };

    function handleFecthList() {
        if (descriptionFilter) {
            const filterValue = `descricao%2Blike%2B${encodeURIComponent(descriptionFilter)}`;
            fetchProcedimentosFilterPage(`?filter=${filterValue}`).then(response => {
                setProcedimentos(response.data.content);
                setTotalItens(response.data.totalElements);
            })
                .catch(error => {
                    console.log('Erro ao buscar procedimentos:', error);
                });
        } else {
            fetchProcedimentos()
                .then(response => {
                    setProcedimentos(response.data.content);
                    setTotalItens(response.data.totalElements);
                })
                .catch(error => {
                    console.log('Erro ao buscar procedimentos:', error);
                });
        }
    }

    function handleFecthEspecialFilterList() {
        if (tipoFilter) {
            const filterValue = `tipo%2Bequal%2B${encodeURIComponent(tipoFilter)}`;
            fetchProcedimentosFilterPage(`?filter=${filterValue}`).then(response => {
                setProcedimentos(response.data.content);
                setTotalItens(response.data.totalElements);
            })
                .catch(error => {
                    console.log('Erro ao buscar procedimentos:', error);
                });
        }
        else {
            fetchProcedimentos()
                .then(response => {
                    setProcedimentos(response.data.content);
                    setTotalItens(response.data.totalElements);
                })
                .catch(error => {
                    console.log('Erro ao buscar procedimentos:', error);
                });
        }
    }

    const handleDelete = async (procedimentoId) => {
        try {
            const confirmation = window.confirm("Tem certeza de que deseja excluir este procedimento?");
            if (confirmation) {
                await deleteProcedimento(procedimentoId);
                alert('Procedimento excluído com sucesso!');
                handleFecthList();  // para atualizar a lista após a exclusão
            }
        } catch (error) {
            console.error("Houve um erro ao excluir o procedimento:", error);
            alert('Erro ao excluir o procedimento. Por favor, tente novamente mais tarde.');
        }
    };

    const handleUpdate = async (procedimentoToUpdate) => {
        try {
            await updateProcedimento(procedimentoToUpdate.id, procedimentoToUpdate);
            alert('Procedimento atualizado com sucesso!');
            handleFecthList();  // Atualiza a lista de procedimentos após a alteração
            handleCloseModal();
            resetProcedimento();
        } catch (error) {
            console.error("Houve um erro ao atualizar o procedimento:", error);
            alert('Erro ao atualizar o procedimento. Por favor, tente novamente mais tarde.');
        }
    };

    const handleEditProcedimento = async (procedimento) => {
        const response = await getProcedimentoById(procedimento.id);
        setProcedimento(response.data); // Define o estado com os dados do procedimento selecionado
        handleOpenModal(); // Abre a modal
    };


    const handleSubmit = async (event) => {
        event.preventDefault(); // Para prevenir o comportamento padrão do formulário

        try {
            const response = await createProcedimento(procedimento);
            // Verificar a resposta conforme necessário (por exemplo, ver se o procedimento foi criado com sucesso)
            if (response.data) {
                alert('Procedimento criado com sucesso!');
                handleCloseModal();
                handleFecthList();
                resetProcedimento();
            } else {
                alert('Erro ao criar o procedimento.');
            }
        } catch (error) {
            console.error("Houve um erro ao criar o procedimento:", error.response.data.erro);
            alert('Erro ao criar o procedimento: ' + error.response.data.erro);
        }
    }

    const fetchProcedimentosFromApi = async (page = 1) => {
        const response = await fetchProcedimentosPage(page - 1);
        setProcedimentos(response.data.content);
        setTotalItens(response.data.totalElements);
    }

    return (
        <div>
            <div className="d-flex justify-content-between mb-3">
                <h2>Listagem de Procedimentos</h2>
                <Button className="btn btn-primary btn-lg" onClick={handleOpenModal}>Cadastrar Procedimento</Button>
            </div>

            <div className="d-flex mb-3">
                {/* Dropdown para filtros especiais */}
                <div className="dropdown me-2">
                    <button className="btn btn-secondary btn-lg dropdown-toggle" type="button" onClick={() => setShowFilters(!showFilters)}>
                        Filtros Especiais
                    </button>
                    <div className={`dropdown-menu ${showFilters ? 'show' : ''}`} style={{ width: '300px' }}>
                        {/* Filtro por porte */}
                        <div className="p-2">
                            <label className="form-label">Filtrar por tipo</label>
                            <select
                                className="form-select"
                                value={tipoFilter}
                                onChange={e => setTipoFilter(e.target.value)}
                            >
                                <option value="">Selecione</option>
                                <option value="CONSULTA">Consulta</option>
                                <option value="EXAME">Exame</option>
                                <option value="INTERNACAO">Internação</option>
                                <option value="CIRURGIA">Cirurgia</option>
                            </select>
                        </div>

                        <div className="p-2 d-flex justify-content-end">
                            <Button className="btn btn-default btn-sm me-2" onClick={() => limparFiltrosEspeciais()}>Limpar</Button>
                            <Button className="btn btn-primary btn-sm" onClick={() => handleFecthEspecialFilterList()}>Buscar</Button>
                        </div>
                    </div>
                </div>

                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Filtrar por descrição" aria-describedby="button-addon2" value={descriptionFilter}
                        onChange={e => setDescriptionFilter(e.target.value)} />
                    <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={() => setDescriptionFilter('')}>Limpar</button>
                    <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={() => handleFecthList()}>Buscar</button>
                </div>
            </div>

            {/* Lista de procedimentos */}
            <table className="table">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Descrição</th>
                        <th>Tipo</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {procedimentos.map(procedimento => (
                        <tr key={procedimento.id}>
                            <td>{procedimento.id}</td>
                            <td>{procedimento.descricao}</td>
                            <td>{procedimento.tipo === 'CIRURGIA'? 'Cirurgia':
                                 procedimento.tipo === 'INTERNACAO'? 'Internação':
                                 procedimento.tipo === 'EXAME'? 'Exame':'Consulta'}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditProcedimento(procedimento)}>Alterar</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(procedimento.id)}>Deletar</button>
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
                    onChangePage={(page) => fetchProcedimentosFromApi(page)}
                />
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar Procedimento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label>Observação:</label>
                        <input type="text" className="form-control" name="observacao" value={procedimento.observacao} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Descrição:</label>
                        <input type="text" className="form-control" name="descricao" value={procedimento.descricao} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Tipo:</label>
                        <select className="form-control" name="tipo" value={procedimento.tipo} onChange={handleInputChange}>
                            <option value="CONSULTA">Consulta</option>
                            <option value="EXAME">Exame</option>
                            <option value="INTERNACAO">Internação</option>
                            <option value="CIRURGIA">Cirurgia</option>
                        </select>
                    </div>
                    <div>
                        <label>Valor Unitário:</label>
                        <input type="number" className="form-control" name="valor" value={procedimento.valor} onChange={handleInputChange} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={(event) => procedimento.id ? handleUpdate(procedimento) : handleSubmit(event)}>
                        {procedimento.id ? 'Atualizar' : 'Salvar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ProcedimentoPage;