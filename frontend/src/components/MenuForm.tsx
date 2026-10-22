import React, { useState } from "react";
import { createMenu } from "../api/menuApi";

interface Props {
    onSuccess: () => void;
}

// Updated hardcoded categories
const CATEGORIES = [
    "Food",
    "Drink",
    "Buffet",
    "Dessert",
    "Snack",
];

export default function MenuForm({ onSuccess }: Props) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !price || !category) return;

        try {
            setSubmitting(true);
            setError(null);

            await createMenu({
                name,
                description,
                price: Number(price),
                category,
            });

            // Reset form on success
            setName("");
            setDescription("");
            setPrice("");
            setCategory("");

            onSuccess();
        } catch (err) {
            console.error("Failed to create menu item:", err);
            setError("Failed to create menu item. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="card-container">
            <h2 className="section-title">Create Menu</h2>

            {error && <p style={{ color: "#dc2626", fontSize: "14px", marginBottom: "12px" }}>{error}</p>}

            <form onSubmit={submit} className="menu-form">
                <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                        id="name"
                        placeholder="Item Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category *</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="" disabled>
                            Select category
                        </option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="price">Price ($) *</label>
                    <input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        rows={3}
                        placeholder="Short description of the menu item..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{
                            padding: "10px 12px",
                            borderRadius: "6px",
                            border: "1px solid #d1d5db",
                            fontSize: "14px",
                            fontFamily: "inherit",
                            outline: "none",
                            resize: "vertical"
                        }}
                    />
                </div>

                <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                    <button type="submit" disabled={submitting} className="btn-primary">
                        {submitting ? "Saving..." : "Save Menu"}
                    </button>
                </div>
            </form>
        </div>
    );
}