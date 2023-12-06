import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchMaterials, createMaterial, updateMaterial, deleteMaterial, getMaterialById, fetchMaterialsPage, fetchMaterialsFilterPage } from '../services/MaterialService';

import { Button, Modal } from 'react-bootstrap';
import Pagination from './Pagination';

function MaterialPage() {
    const [showModal, setShowModal] = useState(false);

    const [material, setMaterial] = useState({
        descricao: '',
        valor: '',
        observacao: '',
    });

    const resetMaterial = () => {
        setMaterial({
            descricao: "",
            observacao: "",
            valor: null,
        });
    }

    const [materials, setMaterials] = useState([]);

    useEffect(() => {
        fetchMaterials()
            .then(response => {
                setMaterials(response.data.content);
                setTotalItens(response.data.totalElements);
            })
            .catch(error => {
                console.log('Erro ao buscar materiais:', error);
            });
    }, []);

    const [descriptionFilter, setDescriptionFilter] = useState('');

    const [showFilters, setShowFilters] = useState(false);

    const [totalItens, setTotalItens] = useState(1);
    const [itemsPerPage] = useState(10);

    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastMaterial = currentPage * itemsPerPage;
    const indexOfFirstMaterial = indexOfLastMaterial - itemsPerPage;

    function handleOpenModal() {
        setShowModal(true);
    }

    function handleCloseModal() {
        setShowModal(false);
        resetMaterial();
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setMaterial(prevMaterial => ({
            ...prevMaterial,
            [name]: value
        }));
    };

    function handleFecthList() {
        if (descriptionFilter) {
            const filterValue = `descricao%2Blike%2B${encodeURIComponent(descriptionFilter)}`;
            fetchMaterialsFilterPage(`?filter=${filterValue}`).then(response => {
                setMaterials(response.data.content);
                setTotalItens(response.data.totalElements);
            })
                .catch(error => {
                    console.log('Erro ao buscar materiais:', error);
                });
        } else {
            fetchMaterials()
                .then(response => {
                    setMaterials(response.data.content);
                    setTotalItens(response.data.totalElements);
                })
                .catch(error => {
                    console.log('Erro ao buscar materiais:', error);
                });
        }
    }

    const handleDelete = async (materialId) => {
        try {
            const confirmation = window.confirm("Tem certeza de que deseja excluir este material?");
            if (confirmation) {
                await deleteMaterial(materialId);
                alert('Material excluído com sucesso!');
                handleFecthList();  // para atualizar a lista após a exclusão
            }
        } catch (error) {
            console.error("Houve um erro ao excluir o material:", error);
            alert('Erro ao excluir o material. Por favor, tente novamente mais tarde.');
        }
    };

    const handleUpdate = async (materialToUpdate) => {
        try {
            await updateMaterial(materialToUpdate.id, materialToUpdate);
            alert('Material atualizado com sucesso!');
            handleFecthList();  // Atualiza a lista de materiais após a alteração
            handleCloseModal();
            resetMaterial();
        } catch (error) {
            console.error("Houve um erro ao atualizar o material:", error);
            alert('Erro ao atualizar o material. Por favor, tente novamente mais tarde.');
        }
    };

    const handleEditMaterial = async (material) => {
        const response = await getMaterialById(material.id);
        setMaterial(response.data); // Define o estado com os dados do material selecionado
        handleOpenModal(); // Abre a modal
    };


    const handleSubmit = async (event) => {
        event.preventDefault(); // Para prevenir o comportamento padrão do formulário

        try {
            const response = await createMaterial(material);
            // Verificar a resposta conforme necessário (por exemplo, ver se o material foi criado com sucesso)
            if (response.data) {
                alert('Material criado com sucesso!');
                handleCloseModal();
                handleFecthList();
                resetMaterial();
            } else {
                alert('Erro ao criar o material.');
            }
        } catch (error) {
            console.error("Houve um erro ao criar o material:", error.response.data.erro);
            alert('Erro ao criar o material: ' + error.response.data.erro);
        }
    }

    const fetchMaterialsFromApi = async (page = 1) => {
        const response = await fetchMaterialsPage(page - 1);
        setMaterials(response.data.content);
        setTotalItens(response.data.totalElements);
    }

    return (
        <div>
            <div className="d-flex justify-content-between mb-3">
                <h2>Listagem de Materiais</h2>
                <Button className="btn btn-primary btn-lg" onClick={handleOpenModal}>Cadastrar Material</Button>
            </div>

            <div className="d-flex mb-3">
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Filtrar por descrição" aria-describedby="button-addon2" value={descriptionFilter}
                        onChange={e => setDescriptionFilter(e.target.value)} />
                    <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={() => setDescriptionFilter('')}>Limpar</button>
                    <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={() => handleFecthList()}>Buscar</button>
                </div>
            </div>

            {/* Lista de materiais */}
            <table className="table">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Descrição</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {materials.map(material => (
                        <tr key={material.id}>
                            <td>{material.id}</td>
                            <td>{material.descricao}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditMaterial(material)}>Alterar</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(material.id)}>Deletar</button>
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
                    onChangePage={(page) => fetchMaterialsFromApi(page)}
                />
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar Material</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label>Observação:</label>
                        <input type="text" className="form-control" name="observacao" value={material.observacao} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Descrição:</label>
                        <input type="text" className="form-control" name="descricao" value={material.descricao} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Valor Unitário:</label>
                        <input type="number" className="form-control" name="valor" value={material.valor} onChange={handleInputChange} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={(event) => material.id ? handleUpdate(material) : handleSubmit(event)}>
                        {material.id ? 'Atualizar' : 'Salvar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default MaterialPage;