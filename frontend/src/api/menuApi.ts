import axios from "axios";
import type { Menu } from "../types/menu";

const API_BASE_URL = "http://localhost:8080/api/menus";

// Create an Axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
});

// Automatically attach the JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getMenus = async () => {
    const response = await api.get<Menu[]>("");
    return response.data;
};

export const createMenu = async (menu: Menu) => {
    const response = await api.post<Menu>("", menu);
    return response.data;
};

export const deleteMenu = async (id: string) => {
    await api.delete(`/${id}`);
};

export const updateMenu = async (id: string, menu: Menu) => {
    const response = await api.put<Menu>(`/${id}`, menu);
    return response.data;
};