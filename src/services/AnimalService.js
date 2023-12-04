import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const fetchAnimals = () => {
    return axios.get(`${API_URL}/animal`);
}

export const fetchAnimalsPage = (page = 1) => {
    return axios.get(`${API_URL}/animal?page=${page}`);
}

export const fetchAnimalsFilterPage = (filter = 1) => {
    return axios.get(`${API_URL}/animal${filter}`);
}

export const createAnimal = (product) => {
    return axios.post(`${API_URL}/animal`, product);
}

export const updateAnimal = (id, product) => {
    return axios.put(`${API_URL}/animal/${id}`, product);
}

export const deleteAnimal = (id) => {
    return axios.delete(`${API_URL}/animal/${id}`);
}

export const getAnimalById = (id) => {
    return axios.get(`${API_URL}/animal/${id}`);
}
