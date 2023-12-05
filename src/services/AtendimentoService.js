import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const fetchAtendimentos = () => {
    return axios.get(`${API_URL}/atendimento`);
}

export const fetchAtendimentosPage = (page = 1) => {
    return axios.get(`${API_URL}/atendimento?page=${page}`);
}

export const fetchAtendimentosFilterPage = (filter = 1) => {
    return axios.get(`${API_URL}/atendimento${filter}`);
}

export const createAtendimento = (product) => {
    return axios.post(`${API_URL}/atendimento`, product);
}

export const updateAtendimento = (id, product) => {
    console.log(product)
    return axios.put(`${API_URL}/atendimento/${id}`, product);
}

export const deleteAtendimento = (id) => {
    return axios.delete(`${API_URL}/atendimento/${id}`);
}

export const getAtendimentoById = (id) => {
    return axios.get(`${API_URL}/atendimento/${id}`);
}
