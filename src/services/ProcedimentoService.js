import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const fetchProcedimentos = () => {
    return axios.get(`${API_URL}/procedimento`);
}

export const fetchProcedimentosPage = (page = 1) => {
    return axios.get(`${API_URL}/procedimento?page=${page}`);
}

export const fetchProcedimentosFilterPage = (filter = 1) => {
    return axios.get(`${API_URL}/procedimento${filter}`);
}

export const createProcedimento = (product) => {
    return axios.post(`${API_URL}/procedimento`, product);
}

export const updateProcedimento = (id, product) => {
    return axios.put(`${API_URL}/procedimento/${id}`, product);
}

export const deleteProcedimento = (id) => {
    return axios.delete(`${API_URL}/procedimento/${id}`);
}

export const getProcedimentoById = (id) => {
    return axios.get(`${API_URL}/procedimento/${id}`);
}
