import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchProducts, createProduct, updateProduct, deleteProduct, getProductById, fetchProductsPage, fetchProductsFilterPage } from '../services/ProductService';

import { Button, Modal } from 'react-bootstrap';
import Pagination from './Pagination';

function ProductPage() {
    const [showModal, setShowModal] = useState(false);

    const [product, setProduct] = useState({
        descricao: '',
        valor: '',
        observacao: '',
    });

    const resetProduct = () => {
        setProduct({
            descricao: "",
            observacao: "",
            valor: null,
        });
    }

    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts()
            .then(response => {
                setProducts(response.data.content);
                setTotalItens(response.data.totalElements);
            })
            .catch(error => {
                console.log('Erro ao buscar produtos:', error);
            });
    }, []);

    const [descriptionFilter, setDescriptionFilter] = useState('');

    const [showFilters, setShowFilters] = useState(false);

    const [totalItens, setTotalItens] = useState(1);
    const [itemsPerPage] = useState(10);

    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;

    function handleOpenModal() {
        setShowModal(true);
    }

    function handleCloseModal() {
        setShowModal(false);
        resetProduct();
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProduct(prevProduct => ({
            ...prevProduct,
            [name]: value
        }));
    };

    function handleFecthList() {
        if (descriptionFilter) {
            const filterValue = `descricao%2Blike%2B${encodeURIComponent(descriptionFilter)}`;
            fetchProductsFilterPage(`?filter=${filterValue}`).then(response => {
                setProducts(response.data.content);
                setTotalItens(response.data.totalElements);
            })
                .catch(error => {
                    console.log('Erro ao buscar produtos:', error);
                });
        } else {
            fetchProducts()
                .then(response => {
                    setProducts(response.data.content);
                    setTotalItens(response.data.totalElements);
                })
                .catch(error => {
                    console.log('Erro ao buscar produtos:', error);
                });
        }
    }

    const handleDelete = async (productId) => {
        try {
            const confirmation = window.confirm("Tem certeza de que deseja excluir este produto?");
            if (confirmation) {
                await deleteProduct(productId);
                alert('Produto excluído com sucesso!');
                handleFecthList();  // para atualizar a lista após a exclusão
            }
        } catch (error) {
            console.error("Houve um erro ao excluir o produto:", error);
            alert('Erro ao excluir o produto. Por favor, tente novamente mais tarde.');
        }
    };

    const handleUpdate = async (productToUpdate) => {
        try {
            await updateProduct(productToUpdate.id, productToUpdate);
            alert('Produto atualizado com sucesso!');
            handleFecthList();  // Atualiza a lista de produtos após a alteração
            handleCloseModal();
            resetProduct();
        } catch (error) {
            console.error("Houve um erro ao atualizar o produto:", error);
            alert('Erro ao atualizar o produto. Por favor, tente novamente mais tarde.');
        }
    };

    const handleEditProduct = async (product) => {
        const response = await getProductById(product.id);
        setProduct(response.data); // Define o estado com os dados do produto selecionado
        handleOpenModal(); // Abre a modal
    };


    const handleSubmit = async (event) => {
        event.preventDefault(); // Para prevenir o comportamento padrão do formulário

        try {
            const response = await createProduct(product);
            // Verificar a resposta conforme necessário (por exemplo, ver se o produto foi criado com sucesso)
            if (response.data) {
                alert('Produto criado com sucesso!');
                handleCloseModal();
                handleFecthList();
                resetProduct();
            } else {
                alert('Erro ao criar o produto.');
            }
        } catch (error) {
            console.error("Houve um erro ao criar o produto:", error.response.data.erro);
            alert('Erro ao criar o produto: ' + error.response.data.erro);
        }
    }

    const fetchProductsFromApi = async (page = 1) => {
        const response = await fetchProductsPage(page - 1);
        setProducts(response.data.content);
        setTotalItens(response.data.totalElements);
    }

    return (
        <div>
            <div className="d-flex justify-content-between mb-3">
                <h2>Listagem de Produtos</h2>
                <Button className="btn btn-primary btn-lg" onClick={handleOpenModal}>Cadastrar Produto</Button>
            </div>

            <div className="d-flex mb-3">
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Filtrar por descrição" aria-describedby="button-addon2" value={descriptionFilter}
                        onChange={e => setDescriptionFilter(e.target.value)} />
                    <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={() => setDescriptionFilter('')}>Limpar</button>
                    <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={() => handleFecthList()}>Buscar</button>
                </div>
            </div>

            {/* Lista de produtos */}
            <table className="table">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Descrição</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.descricao}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditProduct(product)}>Alterar</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product.id)}>Deletar</button>
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
                    onChangePage={(page) => fetchProductsFromApi(page)}
                />
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar Produto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label>Observação:</label>
                        <input type="text" className="form-control" name="observacao" value={product.observacao} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Descrição:</label>
                        <input type="text" className="form-control" name="descricao" value={product.descricao} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Valor Unitário:</label>
                        <input type="number" className="form-control" name="valor" value={product.valor} onChange={handleInputChange} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={(event) => product.id ? handleUpdate(product) : handleSubmit(event)}>
                        {product.id ? 'Atualizar' : 'Salvar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ProductPage;