import axios from "axios";
import type { Menu } from "../types/menu";

const API_BASE_URL = "http://localhost:8080/api/menus";

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getMenus = async () => {
    const response = await api.get<Menu[]>("");
    return response.data;
};

export const createMenu = async (formData: FormData) => {
    const response = await api.post<Menu>("", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

export const updateMenu = async (id: string, formData: FormData) => {
    const response = await api.put<Menu>(`/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

export const deleteMenu = async (id: string) => {
    await api.delete(`/${id}`);
};