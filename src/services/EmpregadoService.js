import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const fetchEmpregados = () => {
    return axios.get(`${API_URL}/empregado`);
}

export const fetchEmpregadosPage = (page = 1) => {
    return axios.get(`${API_URL}/empregado?page=${page}`);
}

export const fetchEmpregadosFilterPage = (filter = 1) => {
    return axios.get(`${API_URL}/empregado${filter}`);
}

export const createEmpregado = (product) => {
    return axios.post(`${API_URL}/empregado`, product);
}

export const updateEmpregado = (id, product) => {
    return axios.put(`${API_URL}/empregado/${id}`, product);
}

export const deleteEmpregado = (id) => {
    return axios.delete(`${API_URL}/empregado/${id}`);
}

export const getEmpregadoById = (id) => {
    return axios.get(`${API_URL}/empregado/${id}`);
}
