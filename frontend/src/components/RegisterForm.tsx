import React, { useState } from "react";
import { registerUser } from "../api/authApi";

interface Props {
    onRegisterSuccess: () => void;
    onSwitchToLogin: () => void;
}

export default function RegisterForm({ onRegisterSuccess, onSwitchToLogin }: Props) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !email.trim() || !password.trim()) return;

        try {
            setLoading(true);
            setError(null);
            await registerUser({ username, email, password });
            alert("Registration successful! Please login.");
            onRegisterSuccess();
        } catch (err) {
            console.error("Registration failed:", err);
            setError("Registration failed. Username or email may already be taken.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card-container" style={{ maxWidth: "400px", margin: "40px auto" }}>
            <h2 className="section-title" style={{ textAlign: "center" }}>Create an Account</h2>

            {error && <p style={{ color: "#dc2626", fontSize: "14px", marginBottom: "12px", textAlign: "center" }}>{error}</p>}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="form-group">
                    <label htmlFor="reg-username">Username</label>
                    <input
                        id="reg-username"
                        type="text"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="reg-email">Email</label>
                    <input
                        id="reg-email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="reg-password">Password</label>
                    <input
                        id="reg-password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", marginTop: "8px" }}>
                    {loading ? "Creating account..." : "Register"}
                </button>
            </form>

            <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#6b7280" }}>
                Already have an account?{" "}
                <button
                    onClick={onSwitchToLogin}
                    style={{ background: "none", border: "none", color: "#4f46e5", cursor: "pointer", fontWeight: 600, padding: 0 }}
                >
                    Login here
                </button>
            </p>
        </div>
    );
}