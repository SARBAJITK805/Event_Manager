import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || "http://localhost:5000/api";

// Register User
export const registerUser = async (userData) => {
    return axios.post(`${API_URL}/auth/register`, {
        fullname: userData.fullname.trim(),
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
    });
};

// Login User
export const loginUser = async (userData) => {
    return axios.post(`${API_URL}/auth/login`, {
        email: userData.email.trim().toLowerCase(),
        password: userData.password.trim(),
    });
};

// Fetch Events
export const fetchEvents = async () => {
    return axios.get(`${API_URL}/events`);
};

// Create Event
export const createEvent = async (eventData, token) => {
    return axios.post(`${API_URL}/events/create`, eventData, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// Join Event
export const joinEvent = async (eventId, token) => {
    return axios.post(`${API_URL}/events/join/${eventId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// Delete Event
export const deleteEvent = async (eventId, token) => {
    return axios.delete(`${API_URL}/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// Update Event
export const updateEvent = async (eventId, updatedData, token) => {
    return axios.put(`${API_URL}/events/${eventId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
