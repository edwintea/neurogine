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

    // Check if token exists in localStorage on initial load
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

    // If not authenticated, render Login or Register
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

    // If authenticated, render the Menu Management Dashboard
    return (
        <div id="center">
            <header style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h1 style={{ fontSize: "22px", margin: 0 }}>Menu Management System</h1>
                <button onClick={handleLogout} className="btn-danger-sm">
                    Logout
                </button>
            </header>

            <div className="counter">
                Total Items: {menus.length}
            </div>

            <main style={{ width: "100%", maxWidth: "800px" }}>
                <MenuForm onSuccess={loadMenus} />
                <div id="spacer" />
                <MenuTable menus={menus} refresh={loadMenus} />
            </main>
        </div>
    );
}