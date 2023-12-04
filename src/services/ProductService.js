import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const fetchProducts = () => {
    return axios.get(`${API_URL}/produto`);
}

export const fetchProductsPage = (page = 1) => {
    return axios.get(`${API_URL}/produto?page=${page}`);
}

export const fetchProductsFilterPage = (filter = 1) => {
    return axios.get(`${API_URL}/produto${filter}`);
}

export const createProduct = (product) => {
    return axios.post(`${API_URL}/produto`, product);
}

export const updateProduct = (id, product) => {
    return axios.put(`${API_URL}/produto/${id}`, product);
}

export const deleteProduct = (id) => {
    return axios.delete(`${API_URL}/produto/${id}`);
}

export const getProductById = (id) => {
    return axios.get(`${API_URL}/produto/${id}`);
}
