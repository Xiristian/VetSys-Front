import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const fetchRemedios = () => {
    return axios.get(`${API_URL}/remedio`);
}

export const fetchRemediosPage = (page = 1) => {
    return axios.get(`${API_URL}/remedio?page=${page}`);
}

export const fetchRemediosFilterPage = (filter = 1) => {
    return axios.get(`${API_URL}/remedio${filter}`);
}

export const createRemedio = (Remedio) => {
    return axios.post(`${API_URL}/remedio`, Remedio);
}

export const updateRemedio = (id, Remedio) => {
    return axios.put(`${API_URL}/remedio/${id}`, Remedio);
}

export const deleteRemedio = (id) => {
    return axios.delete(`${API_URL}/remedio/${id}`);
}

export const getRemedioById = (id) => {
    return axios.get(`${API_URL}/remedio/${id}`);
}
