import { useEffect, useState } from "react";
import MenuForm from "./components/MenuForm";
import MenuTable from "./components/MenuTable";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

import { getMenus } from "./api/menuApi";
import type { Menu } from "./types/menu";

import "./App.css";

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [authView, setAuthView] = useState<"login" | "register">("login");
    const [menus, setMenus] = useState<Menu[]>([]);

    // UI States for Form visibility and editing
    const [showForm, setShowForm] = useState<boolean>(false);
    const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            setIsAuthenticated(true);
            loadMenus();
        }
    }, []);

    const loadMenus = async () => {
        try {
            const data = await getMenus();
            setMenus(data);
        } catch (err) {
            console.error("Failed to load menus:", err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
    };

    const handleOpenCreateForm = () => {
        setEditingMenu(null);
        setShowForm(true);
    };

    const handleOpenEditForm = (menu: Menu) => {
        setEditingMenu(menu);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingMenu(null);
    };

    if (!isAuthenticated) {
        return (
            <div id="center">
                {authView === "login" ? (
                    <LoginForm
                        onLoginSuccess={() => {
                            setIsAuthenticated(true);
                            loadMenus();
                        }}
                        onSwitchToRegister={() => setAuthView("register")}
                    />
                ) : (
                    <RegisterForm
                        onRegisterSuccess={() => setAuthView("login")}
                        onSwitchToLogin={() => setAuthView("login")}
                    />
                )}
            </div>
        );
    }

    return (
        <div id="center">
            <header style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h1 style={{ fontSize: "22px", margin: 0 }}>Menu Management System</h1>
                <button onClick={handleLogout} className="btn-danger-sm">
                    Logout
                </button>
            </header>

            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "800px" }}>
                <div className="counter" style={{ margin: 0 }}>
                    Total Items: {menus.length}
                </div>
                {!showForm && (
                    <button onClick={handleOpenCreateForm} className="btn-primary">
                        + Create New Menu
                    </button>
                )}
            </div>

            <main style={{ width: "100%", maxWidth: "800px" }}>
                {showForm && (
                    <MenuForm
                        editingMenu={editingMenu}
                        onSuccess={loadMenus}
                        onClose={handleCloseForm}
                    />
                )}

                <MenuTable
                    menus={menus}
                    refresh={loadMenus}
                    onEdit={handleOpenEditForm}
                />
            </main>
        </div>
    );
}