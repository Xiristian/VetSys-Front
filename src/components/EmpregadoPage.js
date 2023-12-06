import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchEmpregados, createEmpregado, updateEmpregado, deleteEmpregado, getEmpregadoById, fetchEmpregadosPage, fetchEmpregadosFilterPage } from '../services/EmpregadoService';

import { Button, Modal } from 'react-bootstrap';
import Pagination from './Pagination';

function EmpregadoPage() {
    const [showModal, setShowModal] = useState(false);

    const [empregado, setEmpregado] = useState({
        email: '',
        endereco: '',
        nome: '',
        telefone: '',
        cfmv: '',
        areaAtuacao: '',
    });

    const resetEmpregado = () => {
        setEmpregado({
            email: '',
            endereco: '',
            nome: '',
            telefone: '',
            cfmv: '',
            areaAtuacao: '',
        });
    }

    const [empregados, setEmpregados] = useState([]);

    useEffect(() => {
        fetchEmpregados()
            .then(response => {
                setEmpregados(response.data.content);
                setTotalItens(response.data.totalElements);
            })
            .catch(error => {
                console.log('Erro ao buscar empregados:', error);
            });
    }, []);

    const [nomeFilter, setNomeFilter] = useState('');
    const [enderecoFilter, setEnderecoFilter] = useState('');
    const [CFMVFilter, setCFMVFilter] = useState('');
    const [areaAtuacaoFilter, setAreaAtuacaoFilter] = useState('');

    const [showFilters, setShowFilters] = useState(false);

    const [totalItens, setTotalItens] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const indexOfLastEmpregado = currentPage * itemsPerPage;
    const indexOfFirstEmpregado = indexOfLastEmpregado - itemsPerPage;

    function limparFiltrosEspeciais() {
        setEnderecoFilter('');
        setCFMVFilter('');
        setAreaAtuacaoFilter('');
    }

    function handleOpenModal() {
        setShowModal(true);
    }

    function handleCloseModal() {
        setShowModal(false);
        resetEmpregado();
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEmpregado(prevEmpregado => ({
            ...prevEmpregado,
            [name]: value
        }));
    };

    function handleFecthList() {
        if (nomeFilter) {
            const filterValue = `nome%2Blike%2B${encodeURIComponent(nomeFilter)}`;
            fetchEmpregadosFilterPage(`?filter=${filterValue}`).then(response => {
                setEmpregados(response.data.content);
                setTotalItens(response.data.totalElements);
            })
                .catch(error => {
                    console.log('Erro ao buscar empregados:', error);
                });
        } else {
            fetchEmpregados()
                .then(response => {
                    setEmpregados(response.data.content);
                    setTotalItens(response.data.totalElements);
                })
                .catch(error => {
                    console.log('Erro ao buscar empregados:', error);
                });
        }
    }

    function handleFecthEspecialFilterList() {
        if (enderecoFilter) {
            const filterValue = `endereco%2Blike%2B${encodeURIComponent(enderecoFilter)}`;
            fetchEmpregadosFilterPage(`?filter=${filterValue}`).then(response => {
                setEmpregados(response.data.content);
                setTotalItens(response.data.totalElements);
            })
                .catch(error => {
                    console.log('Erro ao buscar empregados:', error);
                });
        } else if (CFMVFilter) {
            const filterValue = `cfmv%2Bequal%2B${encodeURIComponent(CFMVFilter)}`;
            fetchEmpregadosFilterPage(`?filter=${filterValue}`).then(response => {
                setEmpregados(response.data.content);
                setTotalItens(response.data.totalElements);
            })
                .catch(error => {
                    console.log('Erro ao buscar empregados:', error);
                });
        } else if (areaAtuacaoFilter) {
            const filterValue = `areaAtuacao%2Blike%2B${encodeURIComponent(areaAtuacaoFilter)}`;
            fetchEmpregadosFilterPage(`?filter=${filterValue}`).then(response => {
                setEmpregados(response.data.content);
                setTotalItens(response.data.totalElements);
            })
                .catch(error => {
                    console.log('Erro ao buscar empregados:', error);
                });
        }
        else {
            fetchEmpregados()
                .then(response => {
                    setEmpregados(response.data.content);
                    setTotalItens(response.data.totalElements);
                })
                .catch(error => {
                    console.log('Erro ao buscar empregados:', error);
                });
        }
    }

    const handleDelete = async (empregadoId) => {
        try {
            const confirmation = window.confirm("Tem certeza de que deseja excluir este empregado?");
            if (confirmation) {
                await deleteEmpregado(empregadoId);
                alert('Empregado excluído com sucesso!');
                handleFecthList();
            }
        } catch (error) {
            console.error("Houve um erro ao excluir o empregado:", error);
            alert('Erro ao excluir o empregado. Por favor, tente novamente mais tarde.');
        }
    };

    const handleUpdate = async (empregadoToUpdate) => {
        try {
            await updateEmpregado(empregadoToUpdate.id, empregadoToUpdate);
            alert('Empregado atualizado com sucesso!');
            handleFecthList();
            handleCloseModal();
            resetEmpregado();
        } catch (error) {
            console.error("Houve um erro ao atualizar o empregado:", error);
            alert('Erro ao atualizar o empregado. Por favor, tente novamente mais tarde.');
        }
    };

    const handleEditEmpregado = async (empregado) => {
        const response = await getEmpregadoById(empregado.id);
        setEmpregado(response.data);
        handleOpenModal();
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await createEmpregado(empregado);

            if (response.data) {
                alert('Empregado criado com sucesso!');
                handleCloseModal();
                handleFecthList();
                resetEmpregado();
            } else {
                alert('Erro ao criar o empregado.');
            }
        } catch (error) {
            console.error("Houve um erro ao criar o empregado:", error.response.data.erro);
            alert('Erro ao criar o empregado: ' + error.response.data.erro);
        }
    }

    const fetchEmpregadosFromApi = async (page = 1) => {
        const response = await fetchEmpregadosPage(page - 1);
        setEmpregados(response.data.content);
        setTotalItens(response.data.totalElements);
    }

    return (
        <div>
            <div className="d-flex justify-content-between mb-3">
                <h2>Listagem de Empregados</h2>
                <Button className="btn btn-primary btn-lg" onClick={handleOpenModal}>Cadastrar Empregado</Button>
            </div>

            <div className="d-flex mb-3">
                {/* Dropdown para filtros especiais */}
                <div className="dropdown me-2">
                    <button className="btn btn-secondary btn-lg dropdown-toggle" type="button" onClick={() => setShowFilters(!showFilters)}>
                        Filtros Especiais
                    </button>
                    <div className={`dropdown-menu ${showFilters ? 'show' : ''}`} style={{ width: '300px' }}>
                        {/* Filtro por Endereço */}
                        <div className="p-2">
                            <label className="form-label">Filtrar por endereço</label>
                            <input type="text" className="form-control" value={enderecoFilter} onChange={e => setEnderecoFilter(e.target.value)} />
                        </div>
                        {/* Filtro por CFMV */}
                        <div className="p-2">
                            <label className="form-label">Filtrar por CFMV</label>
                            <input type="text" className="form-control" value={CFMVFilter} onChange={e => setCFMVFilter(e.target.value)} />
                        </div>
                        {/* Filtro por Área de atuação */}
                        <div className="p-2">
                            <label className="form-label">Filtrar por área de atuação</label>
                            <input type="text" className="form-control" value={areaAtuacaoFilter} onChange={e => setAreaAtuacaoFilter(e.target.value)} />
                        </div>
                        <div className="p-2 d-flex justify-content-end">
                            <Button className="btn btn-default btn-sm me-2" onClick={() => limparFiltrosEspeciais()}>Limpar</Button>
                            <Button className="btn btn-primary btn-sm" onClick={() => handleFecthEspecialFilterList()}>Buscar</Button>
                        </div>
                    </div>
                </div>

                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Filtrar por nome" aria-describedby="button-addon2" value={nomeFilter}
                        onChange={e => setNomeFilter(e.target.value)} />
                    <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={() => setNomeFilter('')}>Limpar</button>
                    <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={() => handleFecthList()}>Buscar</button>
                </div>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nome</th>
                        <th>Telefone</th>
                        <th>CFMV</th>
                        <th>Área atuação</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {empregados.map(empregado => (
                        <tr key={empregado.id}>
                            <td>{empregado.id}</td>
                            <td>{empregado.nome}</td>
                            <td>{empregado.telefone}</td>
                            <td>{empregado.cfmv}</td>
                            <td>{empregado.areaAtuacao}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditEmpregado(empregado)}>Alterar</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(empregado.id)}>Deletar</button>
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
                    onChangePage={(page) => fetchEmpregadosFromApi(page)}
                />
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar Empregado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label>Nome:</label>
                        <input type="text" className="form-control" name="nome" value={empregado.nome} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Telefone:</label>
                        <input type="text" className="form-control" name="telefone" value={empregado.telefone} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="text" className="form-control" name="email" value={empregado.email} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Endereço:</label>
                        <input type="text" className="form-control" name="endereco" value={empregado.endereco} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>CFMV:</label>
                        <input type="text" className="form-control" name="cfmv" value={empregado.cfmv} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Área atuação:</label>
                        <input type="text" className="form-control" name="areaAtuacao" value={empregado.areaAtuacao} onChange={handleInputChange} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={(event) => empregado.id ? handleUpdate(empregado) : handleSubmit(event)}>
                        {empregado.id ? 'Atualizar' : 'Salvar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default EmpregadoPage;