import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const fetchInternacaos = () => {
    return axios.get(`${API_URL}/internacao`);
}

export const fetchInternacaosPage = (page = 1) => {
    return axios.get(`${API_URL}/internacao?page=${page}`);
}

export const fetchInternacaosFilterPage = (filter = 1) => {
    return axios.get(`${API_URL}/internacao${filter}`);
}

export const createInternacao = (internacao) => {
    return axios.post(`${API_URL}/internacao`, internacao);
}

export const updateInternacao = (id, internacao) => {
    return axios.put(`${API_URL}/internacao/${id}`, internacao);
}

export const deleteInternacao = (id) => {
    return axios.delete(`${API_URL}/internacao/${id}`);
}

export const getInternacaoById = (id) => {
    return axios.get(`${API_URL}/internacao/${id}`);
}
