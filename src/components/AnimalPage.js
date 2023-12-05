import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchAnimals, createAnimal, updateAnimal, deleteAnimal, getAnimalById, fetchAnimalsPage, fetchAnimalsFilterPage } from '../services/AnimalService';

import { Button, Modal } from 'react-bootstrap';
import Pagination from './Pagination';

function AnimalPage() {
    const [showModal, setShowModal] = useState(false);

    const [animal, setAnimal] = useState({
        nome: '',
        idade: 0,
        observacao: '',
        porte: 'PEQUENO',
        especie: {
            id: 0,
        },
        tutor: {
            id: 0,
        },
    });

    const resetAnimal = () => {
        setAnimal({
            nome: '',
            idade: 0,
            observacao: '',
            porte: 'PEQUENO',
            especie: {
                id: 0,
            },
            tutor: {
                id: 0,
            },
        });
    }

    const [allAnimal, setAllAnimal] = useState([]);

    useEffect(() => {
        fetchAnimals()
            .then(response => {
                setAllAnimal(response.data.content);
                setTotalItens(response.data.totalElements);
            })
            .catch(error => {
                console.log('Erro ao buscar animais:', error);
            });
    }, []);

    const [nomeFilter, setNomeFilter] = useState('');
    const [porteFilter, setPorteFilter] = useState('');

    const [showFilters, setShowFilters] = useState(false);

    const [totalItens, setTotalItens] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const indexOfLastAnimal = currentPage * itemsPerPage;
    const indexOfFirstAnimal = indexOfLastAnimal - itemsPerPage;

    function limparFiltrosEspeciais() {
        setPorteFilter('');
    }

    function handleOpenModal() {
        setShowModal(true);
    }

    function handleCloseModal() {
        setShowModal(false);
        resetAnimal();
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const name_ = name;
        if (name_.includes('-')) {
            const [name, id] = name_.split('-');
            setAnimal(prevAnimal => ({
                ...prevAnimal,
                [name]: {
                    id: value
                }
            }));
        }
        else {
            setAnimal(prevAnimal => ({
                ...prevAnimal,
                [name]: value
            }));
        }
    };

    function handleFecthList() {
        if (nomeFilter) {
            const filterValue = `nome%2Blike%2B${encodeURIComponent(nomeFilter)}`;
            fetchAnimalsFilterPage(`?filter=${filterValue}`).then(response => {
                setAllAnimal(response.data.content);
                setTotalItens(response.data.totalElements);
            })
                .catch(error => {
                    console.log('Erro ao buscar animais:', error);
                });
        } else {
            fetchAnimals()
                .then(response => {
                    setAllAnimal(response.data.content);
                    setTotalItens(response.data.totalElements);
                })
                .catch(error => {
                    console.log('Erro ao buscar animais:', error);
                });
        }
    }

    function handleFecthEspecialFilterList() {
        if (porteFilter) {
            const filterValue = `porte%2Bequal%2B${encodeURIComponent(porteFilter)}`;
            fetchAnimalsFilterPage(`?filter=${filterValue}`).then(response => {
                setAllAnimal(response.data.content);
                setTotalItens(response.data.totalElements);
            })
                .catch(error => {
                    console.log('Erro ao buscar animais:', error);
                });
        }
        else {
            fetchAnimals()
                .then(response => {
                    setAllAnimal(response.data.content);
                    setTotalItens(response.data.totalElements);
                })
                .catch(error => {
                    console.log('Erro ao buscar animais:', error);
                });
        }
    }

    const handleDelete = async (animalId) => {
        try {
            const confirmation = window.confirm("Tem certeza de que deseja excluir esto animal?");
            if (confirmation) {
                await deleteAnimal(animalId);
                alert('Animal excluída com sucesso!');
                handleFecthList();
            }
        } catch (error) {
            console.error("Houve um erro ao excluir o animal:", error);
            alert('Erro ao excluir o animal. Por favor, tente novamente mais tarde.');
        }
    };

    const handleUpdate = async (animalToUpdate) => {
        try {
            await updateAnimal(animalToUpdate.id, animalToUpdate);
            alert('Animal atualizada com sucesso!');
            handleFecthList();
            handleCloseModal();
            resetAnimal();
        } catch (error) {
            console.error("Houve um erro ao atualizar o animal:", error);
            alert('Erro ao atualizar o animal. Por favor, tente novamente mais tarde.');
        }
    };

    const handleEditAnimal = async (animal) => {
        const response = await getAnimalById(animal.id);
        setAnimal(response.data);
        handleOpenModal();
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await createAnimal(animal);

            if (response.data) {
                alert('Animal criada com sucesso!');
                handleCloseModal();
                handleFecthList();
                resetAnimal();
            } else {
                alert('Erro ao criar o animal.');
            }
        } catch (error) {
            console.error("Houve um erro ao criar o animal:", error.response.data.erro);
            alert('Erro ao criar o animal: ' + error.response.data.erro);
        }
    }

    const fetchAnimalsFromApi = async (page = 1) => {
        const response = await fetchAnimalsPage(page - 1);
        setAllAnimal(response.data.content);
        setTotalItens(response.data.totalElements);
    }

    return (
        <div>
            <div className="d-flex justify-content-between mb-3">
                <h2>Listagem de Animais</h2>
                <Button className="btn btn-primary btn-lg" onClick={handleOpenModal}>Cadastrar Animal</Button>
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
                            <label className="form-label">Filtrar por porte</label>
                            <select
                                className="form-select"
                                value={porteFilter}
                                onChange={e => setPorteFilter(e.target.value)}
                            >
                                <option value="">Selecione</option>
                                <option value="PEQUENO">Pequeno</option>
                                <option value="MEDIO">Médio</option>
                                <option value="GRANDE">Grande</option>
                            </select>
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
                        <th>Idade</th>
                        <th>Espécie</th>
                        <th>Tutor</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {allAnimal.map(animal => (
                        <tr key={animal.id}>
                            <td>{animal.id}</td>
                            <td>{animal.nome}</td>
                            <td>{animal.idade}</td>
                            <td>{animal.especie?.descricao}</td>
                            <td>{animal.tutor?.nome}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditAnimal(animal)}>Alterar</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(animal.id)}>Deletar</button>
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
                    onChangePage={(page) => fetchAnimalsFromApi(page)}
                />
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar Animal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label>Nome:</label>
                        <input type="text" className="form-control" name="nome" value={animal.nome} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Idade:</label>
                        <input type="number" className="form-control" name="idade" value={animal.idade} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Observação:</label>
                        <input type="text" className="form-control" name="observacao" value={animal.observacao} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Porte:</label>
                        <select className="form-select" name="porte" value={animal.porte} onChange={handleInputChange}>
                            <option value="PEQUENO">Pequeno</option>
                            <option value="MEDIO">Médio</option>
                            <option value="GRANDE">Grande</option>
                        </select>
                    </div>
                    <div>
                        <label>Espécie:</label>
                        <input type="number" className="form-control" name="especie-id" value={animal.especie?.id} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Tutor:</label>
                        <input type="number" className="form-control" name="tutor-id" value={animal.tutor?.id} onChange={handleInputChange} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={(event) => animal.id ? handleUpdate(animal) : handleSubmit(event)}>
                        {animal.id ? 'Atualizar' : 'Salvar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AnimalPage;