import { useEffect, useState } from "react";
import MenuForm from "./components/MenuForm";
import MenuTable from "./components/MenuTable";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ConfirmDialog from "./components/ConfirmDialog";

import { getMenus } from "./api/menuApi";
import type { Menu } from "./types/menu";

import "./App.css";

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [authView, setAuthView] = useState<"login" | "register">("login");
    const [menus, setMenus] = useState<Menu[]>([]);

    const [showForm, setShowForm] = useState<boolean>(false);
    const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

    // Logout Confirmation State
    const [showLogoutDialog, setShowLogoutDialog] = useState<boolean>(false);

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

    const executeLogout = () => {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
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
                <button onClick={() => setShowLogoutDialog(true)} className="btn-danger-sm">
                    Logout
                </button>
            </header>

            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "800px" }}>
                <div className="counter" style={{ margin: 0 }}>
                    Total Items: {menus.length}
                </div>
                {!showForm && (
                    <button onClick={() => { setEditingMenu(null); setShowForm(true); }} className="btn-primary">
                        + Create New Menu
                    </button>
                )}
            </div>

            <main style={{ width: "100%", maxWidth: "800px" }}>
                {showForm && (
                    <MenuForm
                        editingMenu={editingMenu}
                        onSuccess={loadMenus}
                        onClose={() => { setShowForm(false); setEditingMenu(null); }}
                    />
                )}

                <MenuTable
                    menus={menus}
                    refresh={loadMenus}
                    onEdit={(menu) => { setEditingMenu(menu); setShowForm(true); }}
                />
            </main>

            {/* Custom Logout Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showLogoutDialog}
                title="Confirm Logout"
                message="Are you sure you want to log out of your account?"
                confirmText="Logout"
                cancelText="Cancel"
                isDanger={true}
                onConfirm={executeLogout}
                onClose={() => setShowLogoutDialog(false)}
            />
        </div>
    );
}