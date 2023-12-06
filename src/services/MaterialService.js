import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const fetchMaterials = () => {
    return axios.get(`${API_URL}/material`);
}

export const fetchMaterialsPage = (page = 1) => {
    return axios.get(`${API_URL}/material?page=${page}`);
}

export const fetchMaterialsFilterPage = (filter = 1) => {
    return axios.get(`${API_URL}/material${filter}`);
}

export const createMaterial = (Material) => {
    return axios.post(`${API_URL}/material`, Material);
}

export const updateMaterial = (id, Material) => {
    return axios.put(`${API_URL}/material/${id}`, Material);
}

export const deleteMaterial = (id) => {
    return axios.delete(`${API_URL}/material/${id}`);
}

export const getMaterialById = (id) => {
    return axios.get(`${API_URL}/material/${id}`);
}
