import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const fetchSpecies = () => {
    return axios.get(`${API_URL}/especie`);
}

export const fetchSpeciesPage = (page = 1) => {
    return axios.get(`${API_URL}/especie?page=${page}`);
}

export const fetchSpeciesFilterPage = (filter = 1) => {
    return axios.get(`${API_URL}/especie${filter}`);
}

export const createSpecies = (product) => {
    return axios.post(`${API_URL}/especie`, product);
}

export const updateSpecies = (id, product) => {
    return axios.put(`${API_URL}/especie/${id}`, product);
}

export const deleteSpecies = (id) => {
    return axios.delete(`${API_URL}/especie/${id}`);
}

export const getSpeciesById = (id) => {
    return axios.get(`${API_URL}/especie/${id}`);
}
