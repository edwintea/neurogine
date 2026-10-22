import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const loginUser = async (credentials: { username: string; password: string }) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
};

export const registerUser = async (userData: { username: string; email: string; password: string }) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};