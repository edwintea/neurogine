import axios from "axios";
import type {Menu} from "../types/menu";

const API_URL = "http://localhost:8080/api/menus";

export const getMenus = async () => {
    const response = await axios.get<Menu[]>(API_URL);
    return response.data;
};

export const createMenu = async (menu: Menu) => {
    const response = await axios.post<Menu>(
        API_URL,
        menu
    );

    return response.data;
};

export const deleteMenu = async (
    id: string
) => {
    await axios.delete(`${API_URL}/${id}`);
};

export const updateMenu = async (
    id: string,
    menu: Menu
) => {
    const response = await axios.put<Menu>(
        `${API_URL}/${id}`,
        menu
    );

    return response.data;
};