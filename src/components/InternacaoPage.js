import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchInternacaos, createInternacao, updateInternacao, deleteInternacao, getInternacaoById, fetchInternacaosPage, fetchInternacaosFilterPage } from '../services/InternacaoService';

import { Button, Modal } from 'react-bootstrap';
import Pagination from './Pagination';

function InternacaoPage() {
    const [showModal, setShowModal] = useState(false);

    const [internacao, setInternacao] = useState({
        descricao: '',
        valor: '',
        observacao: '',
    });

    const resetInternacao = () => {
        setInternacao({
            descricao: "",
            observacao: "",
            valor: null,
        });
    }

    const [internacaos, setInternacaos] = useState([]);

    useEffect(() => {
        fetchInternacaos()
            .then(response => {
                setInternacaos(response.data.content);
                setTotalItens(response.data.totalElements);
            })
            .catch(error => {
                console.log('Erro ao buscar internações:', error);
            });
    }, []);

    const [descriptionFilter, setDescriptionFilter] = useState('');

    const [showFilters, setShowFilters] = useState(false);

    const [totalItens, setTotalItens] = useState(1);
    const [itemsPerPage] = useState(10);

    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastInternacao = currentPage * itemsPerPage;
    const indexOfFirstInternacao = indexOfLastInternacao - itemsPerPage;

    function handleOpenModal() {
        setShowModal(true);
    }

    function handleCloseModal() {
        setShowModal(false);
        resetInternacao();
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInternacao(prevInternacao => ({
            ...prevInternacao,
            [name]: value
        }));
    };

    function handleFecthList() {
        if (descriptionFilter) {
            const filterValue = `descricao%2Blike%2B${encodeURIComponent(descriptionFilter)}`;
            fetchInternacaosFilterPage(`?filter=${filterValue}`).then(response => {
                setInternacaos(response.data.content);
                setTotalItens(response.data.totalElements);
            })
                .catch(error => {
                    console.log('Erro ao buscar internações:', error);
                });
        } else {
            fetchInternacaos()
                .then(response => {
                    setInternacaos(response.data.content);
                    setTotalItens(response.data.totalElements);
                })
                .catch(error => {
                    console.log('Erro ao buscar internações:', error);
                });
        }
    }

    const handleDelete = async (internacaoId) => {
        try {
            const confirmation = window.confirm("Tem certeza de que deseja excluir este internação?");
            if (confirmation) {
                await deleteInternacao(internacaoId);
                alert('Internação excluído com sucesso!');
                handleFecthList();  // para atualizar a lista após a exclusão
            }
        } catch (error) {
            console.error("Houve um erro ao excluir o internação:", error);
            alert('Erro ao excluir o internação. Por favor, tente novamente mais tarde.');
        }
    };

    const handleUpdate = async (internacaoToUpdate) => {
        try {
            await updateInternacao(internacaoToUpdate.id, internacaoToUpdate);
            alert('Internação atualizado com sucesso!');
            handleFecthList();  // Atualiza a lista de internações após a alteração
            handleCloseModal();
            resetInternacao();
        } catch (error) {
            console.error("Houve um erro ao atualizar o internação:", error);
            alert('Erro ao atualizar o internação. Por favor, tente novamente mais tarde.');
        }
    };

    const handleEditInternacao = async (internacao) => {
        const response = await getInternacaoById(internacao.id);
        setInternacao(response.data); // Define o estado com os dados do internação selecionado
        handleOpenModal(); // Abre a modal
    };


    const handleSubmit = async (event) => {
        event.preventDefault(); // Para prevenir o comportamento padrão do formulário

        try {
            const response = await createInternacao(internacao);
            // Verificar a resposta conforme necessário (por exemplo, ver se o internação foi criado com sucesso)
            if (response.data) {
                alert('Internação criado com sucesso!');
                handleCloseModal();
                handleFecthList();
                resetInternacao();
            } else {
                alert('Erro ao criar o internação.');
            }
        } catch (error) {
            console.error("Houve um erro ao criar o internação:", error.response.data.erro);
            alert('Erro ao criar o internação: ' + error.response.data.erro);
        }
    }

    const fetchInternacaosFromApi = async (page = 1) => {
        const response = await fetchInternacaosPage(page - 1);
        setInternacaos(response.data.content);
        setTotalItens(response.data.totalElements);
    }

    return (
        <div>
            <div className="d-flex justify-content-between mb-3">
                <h2>Listagem de Internações</h2>
                <Button className="btn btn-primary btn-lg" onClick={handleOpenModal}>Cadastrar Internação</Button>
            </div>

            <div className="d-flex mb-3">
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Filtrar por descrição" aria-describedby="button-addon2" value={descriptionFilter}
                        onChange={e => setDescriptionFilter(e.target.value)} />
                    <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={() => setDescriptionFilter('')}>Limpar</button>
                    <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={() => handleFecthList()}>Buscar</button>
                </div>
            </div>

            {/* Lista de internações */}
            <table className="table">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Descrição</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {internacaos.map(internacao => (
                        <tr key={internacao.id}>
                            <td>{internacao.id}</td>
                            <td>{internacao.descricao}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditInternacao(internacao)}>Alterar</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(internacao.id)}>Deletar</button>
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
                    onChangePage={(page) => fetchInternacaosFromApi(page)}
                />
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar Internação</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label>Observação:</label>
                        <input type="text" className="form-control" name="observacao" value={internacao.observacao} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Descrição:</label>
                        <input type="text" className="form-control" name="descricao" value={internacao.descricao} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Valor Unitário:</label>
                        <input type="number" className="form-control" name="valor" value={internacao.valor} onChange={handleInputChange} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={(event) => internacao.id ? handleUpdate(internacao) : handleSubmit(event)}>
                        {internacao.id ? 'Atualizar' : 'Salvar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default InternacaoPage;