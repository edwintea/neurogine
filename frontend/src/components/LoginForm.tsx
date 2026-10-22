import React, { useState } from "react";
import { loginUser } from "../api/authApi";

interface Props {
    onLoginSuccess: (token: string) => void;
    onSwitchToRegister: () => void;
}

export default function LoginForm({ onLoginSuccess, onSwitchToRegister }: Props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) return;

        try {
            setLoading(true);
            setError(null);
            const data = await loginUser({ username, password });

            // Assuming backend returns a token or user object
            const token = data.token || "mock-token-123";
            localStorage.setItem("authToken", token);
            onLoginSuccess(token);
        } catch (err) {
            console.error("Login failed:", err);
            setError("Invalid username or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card-container" style={{ maxWidth: "400px", margin: "40px auto" }}>
            <h2 className="section-title" style={{ textAlign: "center" }}>Welcome Back</h2>

            {error && <p style={{ color: "#dc2626", fontSize: "14px", marginBottom: "12px", textAlign: "center" }}>{error}</p>}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", marginTop: "8px" }}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#6b7280" }}>
                Don't have an account?{" "}
                <button
                    onClick={onSwitchToRegister}
                    style={{ background: "none", border: "none", color: "#4f46e5", cursor: "pointer", fontWeight: 600, padding: 0 }}
                >
                    Register here
                </button>
            </p>
        </div>
    );
}