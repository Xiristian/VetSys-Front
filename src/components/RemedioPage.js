import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchRemedios, createRemedio, updateRemedio, deleteRemedio, getRemedioById, fetchRemediosPage, fetchRemediosFilterPage } from '../services/RemedioService';

import { Button, Modal } from 'react-bootstrap';
import Pagination from './Pagination';

function RemedioPage() {
    const [showModal, setShowModal] = useState(false);

    const [remedio, setRemedio] = useState({
        descricao: '',
        valor: '',
        observacao: '',
        contraIndicacoes: '',
    });

    const resetRemedio = () => {
        setRemedio({
            descricao: "",
            observacao: "",
            valor: null,
            contraIndicacoes: '',
        });
    }

    const [remedios, setRemedios] = useState([]);

    useEffect(() => {
        fetchRemedios()
            .then(response => {
                setRemedios(response.data.content);
                setTotalItens(response.data.totalElements);
            })
            .catch(error => {
                console.log('Erro ao buscar remédios:', error);
            });
    }, []);

    const [descriptionFilter, setDescriptionFilter] = useState('');

    const [showFilters, setShowFilters] = useState(false);

    const [totalItens, setTotalItens] = useState(1);
    const [itemsPerPage] = useState(10);

    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastRemedio = currentPage * itemsPerPage;
    const indexOfFirstRemedio = indexOfLastRemedio - itemsPerPage;

    function handleOpenModal() {
        setShowModal(true);
    }

    function handleCloseModal() {
        setShowModal(false);
        resetRemedio();
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setRemedio(prevRemedio => ({
            ...prevRemedio,
            [name]: value
        }));
    };

    function handleFecthList() {
        if (descriptionFilter) {
            const filterValue = `descricao%2Blike%2B${encodeURIComponent(descriptionFilter)}`;
            fetchRemediosFilterPage(`?filter=${filterValue}`).then(response => {
                setRemedios(response.data.content);
                setTotalItens(response.data.totalElements);
            })
                .catch(error => {
                    console.log('Erro ao buscar remédios:', error);
                });
        } else {
            fetchRemedios()
                .then(response => {
                    setRemedios(response.data.content);
                    setTotalItens(response.data.totalElements);
                })
                .catch(error => {
                    console.log('Erro ao buscar remédios:', error);
                });
        }
    }

    const handleDelete = async (remedioId) => {
        try {
            const confirmation = window.confirm("Tem certeza de que deseja excluir este remédio?");
            if (confirmation) {
                await deleteRemedio(remedioId);
                alert('Remédio excluído com sucesso!');
                handleFecthList();  // para atualizar a lista após a exclusão
            }
        } catch (error) {
            console.error("Houve um erro ao excluir o remédio:", error);
            alert('Erro ao excluir o remédio. Por favor, tente novamente mais tarde.');
        }
    };

    const handleUpdate = async (remedioToUpdate) => {
        try {
            await updateRemedio(remedioToUpdate.id, remedioToUpdate);
            alert('Remédio atualizado com sucesso!');
            handleFecthList();  // Atualiza a lista de remédios após a alteração
            handleCloseModal();
            resetRemedio();
        } catch (error) {
            console.error("Houve um erro ao atualizar o remédio:", error);
            alert('Erro ao atualizar o remédio. Por favor, tente novamente mais tarde.');
        }
    };

    const handleEditRemedio = async (remedio) => {
        const response = await getRemedioById(remedio.id);
        setRemedio(response.data); // Define o estado com os dados do remédio selecionado
        handleOpenModal(); // Abre a modal
    };


    const handleSubmit = async (event) => {
        event.preventDefault(); // Para prevenir o comportamento padrão do formulário

        try {
            const response = await createRemedio(remedio);
            // Verificar a resposta conforme necessário (por exemplo, ver se o remédio foi criado com sucesso)
            if (response.data) {
                alert('Remédio criado com sucesso!');
                handleCloseModal();
                handleFecthList();
                resetRemedio();
            } else {
                alert('Erro ao criar o remédio.');
            }
        } catch (error) {
            console.error("Houve um erro ao criar o remédio:", error.response.data.erro);
            alert('Erro ao criar o remédio: ' + error.response.data.erro);
        }
    }

    const fetchRemediosFromApi = async (page = 1) => {
        const response = await fetchRemediosPage(page - 1);
        setRemedios(response.data.content);
        setTotalItens(response.data.totalElements);
    }

    return (
        <div>
            <div className="d-flex justify-content-between mb-3">
                <h2>Listagem de Remédios</h2>
                <Button className="btn btn-primary btn-lg" onClick={handleOpenModal}>Cadastrar Remédio</Button>
            </div>

            <div className="d-flex mb-3">
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Filtrar por descrição" aria-describedby="button-addon2" value={descriptionFilter}
                        onChange={e => setDescriptionFilter(e.target.value)} />
                    <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={() => setDescriptionFilter('')}>Limpar</button>
                    <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={() => handleFecthList()}>Buscar</button>
                </div>
            </div>

            {/* Lista de remédios */}
            <table className="table">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Descrição</th>
                        <th>Contra Indicações</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {remedios.map(remedio => (
                        <tr key={remedio.id}>
                            <td>{remedio.id}</td>
                            <td>{remedio.descricao}</td>
                            <td>{remedio.contraIndicacoes}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditRemedio(remedio)}>Alterar</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(remedio.id)}>Deletar</button>
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
                    onChangePage={(page) => fetchRemediosFromApi(page)}
                />
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar Remédio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label>Observação:</label>
                        <input type="text" className="form-control" name="observacao" value={remedio.observacao} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Descrição:</label>
                        <input type="text" className="form-control" name="descricao" value={remedio.descricao} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Contra Indicações:</label>
                        <input type="text" className="form-control" name="contraIndicacoes" value={remedio.contraIndicacoes} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Valor Unitário:</label>
                        <input type="number" className="form-control" name="valor" value={remedio.valor} onChange={handleInputChange} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={(event) => remedio.id ? handleUpdate(remedio) : handleSubmit(event)}>
                        {remedio.id ? 'Atualizar' : 'Salvar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default RemedioPage;