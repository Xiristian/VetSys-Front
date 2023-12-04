import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchSpecies, createSpecies, updateSpecies, deleteSpecies, getSpeciesById, fetchSpeciesPage, fetchSpeciesFilterPage } from '../services/SpeciesService';

import { Button, Modal } from 'react-bootstrap';
import Pagination from './Pagination';

function SpeciesPage() {
    const [showModal, setShowModal] = useState(false);

    const [species, setSpecies] = useState({
        descricao: '',
    });

    const resetSpecies = () => {
        setSpecies({
            descricao: '',
        });
    }

    const [allSpecies, setAllSpecies] = useState([]);

    useEffect(() => {
        fetchSpecies()
            .then(response => {
                setAllSpecies(response.data.content);
                setTotalItens(response.data.totalElements);
            })
            .catch(error => {
                console.log('Erro ao buscar espécies:', error);
            });
    }, []);

    const [descricaoFilter, setDescricaoFilter] = useState('');

    const [totalItens, setTotalItens] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const indexOfLastSpecies = currentPage * itemsPerPage;
    const indexOfFirstSpecies = indexOfLastSpecies - itemsPerPage;

    function handleOpenModal() {
        setShowModal(true);
    }

    function handleCloseModal() {
        setShowModal(false);
        resetSpecies();
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSpecies(prevSpecies => ({
            ...prevSpecies,
            [name]: value
        }));
    };

    function handleFecthList() {
        if (descricaoFilter) {
            const filterValue = `descricao%2Blike%2B${encodeURIComponent(descricaoFilter)}`;
            fetchSpeciesFilterPage(`?filter=${filterValue}`).then(response => {
                setAllSpecies(response.data.content);
                setTotalItens(response.data.totalElements);
            })
                .catch(error => {
                    console.log('Erro ao buscar espécies:', error);
                });
        } else {
            fetchSpecies()
                .then(response => {
                    setAllSpecies(response.data.content);
                    setTotalItens(response.data.totalElements);
                })
                .catch(error => {
                    console.log('Erro ao buscar espécies:', error);
                });
        }
    }

    const handleDelete = async (speciesId) => {
        try {
            const confirmation = window.confirm("Tem certeza de que deseja excluir esta espécie?");
            if (confirmation) {
                await deleteSpecies(speciesId);
                alert('Espécie excluída com sucesso!');
                handleFecthList();
            }
        } catch (error) {
            console.error("Houve um erro ao excluir a espécie:", error);
            alert('Erro ao excluir a espécie. Por favor, tente novamente mais tarde.');
        }
    };

    const handleUpdate = async (speciesToUpdate) => {
        try {
            await updateSpecies(speciesToUpdate.id, speciesToUpdate);
            alert('Espécie atualizada com sucesso!');
            handleFecthList();
            handleCloseModal();
            resetSpecies();
        } catch (error) {
            console.error("Houve um erro ao atualizar a espécie:", error);
            alert('Erro ao atualizar a espécie. Por favor, tente novamente mais tarde.');
        }
    };

    const handleEditSpecies = async (species) => {
        const response = await getSpeciesById(species.id);
        setSpecies(response.data);
        handleOpenModal();
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await createSpecies(species);

            if (response.data) {
                alert('Espécie criada com sucesso!');
                handleCloseModal();
                handleFecthList();
                resetSpecies();
            } else {
                alert('Erro ao criar a espécie.');
            }
        } catch (error) {
            console.error("Houve um erro ao criar a espécie:", error.response.data.erro);
            alert('Erro ao criar a espécie: ' + error.response.data.erro);
        }
    }

    const fetchSpeciesFromApi = async (page = 1) => {
        const response = await fetchSpeciesPage(page - 1);
        setAllSpecies(response.data.content);
        setTotalItens(response.data.totalElements);
    }

    return (
        <div>
            <div className="d-flex justify-content-between mb-3">
                <h2>Listagem de Espécies</h2>
                <Button className="btn btn-primary btn-lg" onClick={handleOpenModal}>Cadastrar Espécie</Button>
            </div>

            <div className="d-flex mb-3">
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Filtrar por descrição" aria-describedby="button-addon2" value={descricaoFilter}
                        onChange={e => setDescricaoFilter(e.target.value)} />
                    <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={() => setDescricaoFilter('')}>Limpar</button>
                    <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={() => handleFecthList()}>Buscar</button>
                </div>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Descrição</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {allSpecies.map(species => (
                        <tr key={species.id}>
                            <td>{species.id}</td>
                            <td>{species.descricao}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditSpecies(species)}>Alterar</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(species.id)}>Deletar</button>
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
                    onChangePage={(page) => fetchSpeciesFromApi(page)}
                />
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar Espécie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label>Descrição:</label>
                        <input type="text" className="form-control" name="descricao" value={species.descricao} onChange={handleInputChange} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={(event) => species.id ? handleUpdate(species) : handleSubmit(event)}>
                        {species.id ? 'Atualizar' : 'Salvar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default SpeciesPage;