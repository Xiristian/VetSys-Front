import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchTutors, createTutor, updateTutor, deleteTutor, getTutorById, fetchTutorsPage, fetchTutorsFilterPage } from '../services/TutorService';

import { Button, Modal } from 'react-bootstrap';
import Pagination from './Pagination';
import { convertBackendDateToFrontend } from './Utils';

function TutorPage() {
    const [showModal, setShowModal] = useState(false);

    const [tutor, setTutor] = useState({
        email: '',
        endereco: '',
        nome: '',
        telefone: '',
        cpf: '',
    });

    const resetTutor = () => {
        setTutor({
            email: '',
            endereco: '',
            nome: '',
            telefone: '',
            cpf: '',
        });
    }

    const [tutors, setTutors] = useState([]);

    useEffect(() => {
        fetchTutors()
            .then(response => {
                setTutors(response.data.content);
                setTotalItens(response.data.totalElements);
            })
            .catch(error => {
                console.log('Erro ao buscar tutores:', error);
            });
    }, []);

    const [nomeFilter, setNomeFilter] = useState('');
    const [enderecoFilter, setEnderecoFilter] = useState('');
    const [CPFFilter, setCPFFilter] = useState('');

    const [showFilters, setShowFilters] = useState(false);

    const [totalItens, setTotalItens] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const indexOfLastTutor = currentPage * itemsPerPage;
    const indexOfFirstTutor = indexOfLastTutor - itemsPerPage;

    function limparFiltrosEspeciais() {
        setEnderecoFilter('');
        setCPFFilter('');
    }

    function handleOpenModal() {
        setShowModal(true);
    }

    function handleCloseModal() {
        setShowModal(false);
        resetTutor();
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setTutor(prevTutor => ({
            ...prevTutor,
            [name]: value
        }));
    };

    function handleFecthList() {
        if (nomeFilter) {
            const filterValue = `descricao%2Blike%2B${encodeURIComponent(nomeFilter)}`;
            fetchTutorsFilterPage(`?filter=${filterValue}`).then(response => {
                setTutors(response.data.content);
                setTotalItens(response.data.totalElements);
            })
                .catch(error => {
                    console.log('Erro ao buscar tutores:', error);
                });
        } else {
            fetchTutors()
                .then(response => {
                    setTutors(response.data.content);
                    setTotalItens(response.data.totalElements);
                })
                .catch(error => {
                    console.log('Erro ao buscar tutores:', error);
                });
        }
    }

    function handleFecthEspecialFilterList() {
        if (enderecoFilter) {
            const filterValue = `endereco%2Bequal%2B${encodeURIComponent(enderecoFilter)}`;
            fetchTutorsFilterPage(`?filter=${filterValue}`).then(response => {
                setTutors(response.data.content);
                setTotalItens(response.data.totalElements);
            })
                .catch(error => {
                    console.log('Erro ao buscar tutores:', error);
                });
        } else if (CPFFilter) {
            const filterValue = `cpf%2Bequal%2B${encodeURIComponent(CPFFilter)}`;
            fetchTutorsFilterPage(`?filter=${filterValue}`).then(response => {
                setTutors(response.data.content);
                setTotalItens(response.data.totalElements);
            })
                .catch(error => {
                    console.log('Erro ao buscar tutores:', error);
                });
        }
        else {
            fetchTutors()
                .then(response => {
                    setTutors(response.data.content);
                    setTotalItens(response.data.totalElements);
                })
                .catch(error => {
                    console.log('Erro ao buscar tutores:', error);
                });
        }
    }

    const handleDelete = async (tutorId) => {
        try {
            const confirmation = window.confirm("Tem certeza de que deseja excluir este tutor?");
            if (confirmation) {
                await deleteTutor(tutorId);
                alert('Tutor excluído com sucesso!');
                handleFecthList();
            }
        } catch (error) {
            console.error("Houve um erro ao excluir o tutor:", error);
            alert('Erro ao excluir o tutor. Por favor, tente novamente mais tarde.');
        }
    };

    const handleUpdate = async (tutorToUpdate) => {
        try {
            await updateTutor(tutorToUpdate.id, tutorToUpdate);
            alert('Tutor atualizado com sucesso!');
            handleFecthList();
            handleCloseModal();
            resetTutor();
        } catch (error) {
            console.error("Houve um erro ao atualizar o tutor:", error);
            alert('Erro ao atualizar o tutor. Por favor, tente novamente mais tarde.');
        }
    };

    const handleEditTutor = async (tutor) => {
        const response = await getTutorById(tutor.id);
        setTutor(response.data);
        handleOpenModal();
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await createTutor(tutor);

            if (response.data) {
                alert('Tutor criado com sucesso!');
                handleCloseModal();
                handleFecthList();
                resetTutor();
            } else {
                alert('Erro ao criar o tutor.');
            }
        } catch (error) {
            console.error("Houve um erro ao criar o tutor:", error.response.data.erro);
            alert('Erro ao criar o tutor: ' + error.response.data.erro);
        }
    }

    const fetchTutorsFromApi = async (page = 1) => {
        const response = await fetchTutorsPage(page - 1);
        setTutors(response.data.content);
        setTotalItens(response.data.totalElements);
    }

    return (
        <div>
            <div className="d-flex justify-content-between mb-3">
                <h2>Listagem de Tutores</h2>
                <Button className="btn btn-primary btn-lg" onClick={handleOpenModal}>Cadastrar Tutor</Button>
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
                        {/* Filtro por CPF */}
                        <div className="p-2">
                            <label className="form-label">Filtrar por CPF</label>
                            <input type="text" className="form-control" value={CPFFilter} onChange={e => setCPFFilter(e.target.value)} />
                        </div>
                        <div className="p-2 d-flex justify-content-end">
                            <Button className="btn btn-default btn-sm me-2" onClick={() => limparFiltrosEspeciais()}>Limpar</Button>
                            <Button className="btn btn-primary btn-sm" onClick={() => handleFecthEspecialFilterList()}>Buscar</Button>
                        </div>
                    </div>
                </div>

                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Filtrar por descrição" aria-describedby="button-addon2" value={nomeFilter}
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
                        <th>CPF</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {tutors.map(tutor => (
                        <tr key={tutor.id}>
                            <td>{tutor.id}</td>
                            <td>{tutor.nome}</td>
                            <td>{tutor.telefone}</td>
                            <td>{tutor.cpf}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditTutor(tutor)}>Alterar</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(tutor.id)}>Deletar</button>
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
                    onChangePage={(page) => fetchTutorsFromApi(page)}
                />
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar Tutor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label>Nome:</label>
                        <input type="text" className="form-control" name="nome" value={tutor.nome} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Telefone:</label>
                        <input type="text" className="form-control" name="telefone" value={tutor.telefone} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="text" className="form-control" name="email" value={tutor.email} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Endereço:</label>
                        <input type="text" className="form-control" name="endereco" value={tutor.endereco} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>CPF:</label>
                        <input type="text" className="form-control" name="cpf" value={tutor.cpf} onChange={handleInputChange} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={(event) => tutor.id ? handleUpdate(tutor) : handleSubmit(event)}>
                        {tutor.id ? 'Atualizar' : 'Salvar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default TutorPage;