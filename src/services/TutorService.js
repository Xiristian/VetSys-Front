import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const fetchTutors = () => {
    return axios.get(`${API_URL}/tutor`);
}

export const fetchTutorsPage = (page = 1) => {
    return axios.get(`${API_URL}/tutor?page=${page}`);
}

export const fetchTutorsFilterPage = (filter = 1) => {
    console.log(filter);
    return axios.get(`${API_URL}/tutor${filter}`);
}

export const createTutor = (product) => {
    return axios.post(`${API_URL}/tutor`, product);
}

export const updateTutor = (id, product) => {
    return axios.put(`${API_URL}/tutor/${id}`, product);
}

export const deleteTutor = (id) => {
    return axios.delete(`${API_URL}/tutor/${id}`);
}

export const getTutorById = (id) => {
    return axios.get(`${API_URL}/tutor/${id}`);
}
