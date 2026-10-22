import React, { useState, useEffect } from "react";
import { createMenu, updateMenu } from "../api/menuApi";
import type { Menu } from "../types/menu";

interface Props {
    editingMenu?: Menu | null;
    onSuccess: () => void;
    onClose: () => void;
}

const CATEGORIES = ["Food", "Drink", "Buffet", "Dessert", "Snack"];

interface FormErrors {
    name?: string;
    category?: string;
    price?: string;
    image?: string;
    general?: string;
}

export default function MenuForm({ editingMenu, onSuccess, onClose }: Props) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (editingMenu) {
            setName(editingMenu.name || "");
            setDescription(editingMenu.description || "");
            setPrice(editingMenu.price ? editingMenu.price.toString() : "");
            setCategory(editingMenu.category || "");
            setImageFile(null);
        } else {
            setName("");
            setDescription("");
            setPrice("");
            setCategory("");
            setImageFile(null);
        }
        setErrors({});
    }, [editingMenu]);

    // Validation function
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!name.trim()) {
            newErrors.name = "Menu item name is required.";
        } else if (name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters long.";
        }

        if (!category) {
            newErrors.category = "Please select a category.";
        }

        if (!price) {
            newErrors.price = "Price is required.";
        } else {
            const numPrice = Number(price);
            if (isNaN(numPrice) || numPrice <= 0) {
                newErrors.price = "Price must be a valid number greater than 0.";
            }
        }

        if (imageFile) {
            if (!imageFile.type.startsWith("image/")) {
                newErrors.image = "Only image files (JPEG, PNG, etc.) are allowed.";
            } else if (imageFile.size > 5 * 1024 * 1024) { // 5MB limit
                newErrors.image = "Image size must be less than 5MB.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Run validation before submitting
        if (!validateForm()) return;

        try {
            setSubmitting(true);
            setErrors({});

            const formData = new FormData();
            formData.append("name", name.trim());
            formData.append("description", description.trim());
            formData.append("price", price);
            formData.append("category", category);
            if (imageFile) {
                formData.append("file", imageFile);
            }

            if (editingMenu && editingMenu.id) {
                await updateMenu(editingMenu.id, formData);
            } else {
                await createMenu(formData);
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error("Failed to save menu item:", err);
            setErrors({ general: "Failed to save menu item. Please check your connection and try again." });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="card-container" style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 className="section-title" style={{ margin: 0 }}>
                    {editingMenu ? "Edit Menu Item" : "Create New Menu"}
                </h2>
                <button type="button" onClick={onClose} className="btn-danger-sm" style={{ backgroundColor: "#f3f4f6", color: "#374151" }}>
                    Cancel
                </button>
            </div>

            {errors.general && <p style={{ color: "#dc2626", fontSize: "14px", marginBottom: "12px" }}>{errors.general}</p>}

            <form onSubmit={submit} className="menu-form" noValidate>
                <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                        id="name"
                        placeholder="Item Name"
                        value={name}
                        onChange={(e) => { setName(e.target.value); if (errors.name) setErrors({ ...errors, name: undefined }); }}
                        style={{ borderColor: errors.name ? "#dc2626" : undefined }}
                    />
                    {errors.name && <span style={{ color: "#dc2626", fontSize: "12px", marginTop: "2px" }}>{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category *</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => { setCategory(e.target.value); if (errors.category) setErrors({ ...errors, category: undefined }); }}
                        style={{ borderColor: errors.category ? "#dc2626" : undefined, backgroundColor: "#fff" }}
                    >
                        <option value="" disabled>Select category</option>
                        {CATEGORIES.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                    </select>
                    {errors.category && <span style={{ color: "#dc2626", fontSize: "12px", marginTop: "2px" }}>{errors.category}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="price">Price ($) *</label>
                    <input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => { setPrice(e.target.value); if (errors.price) setErrors({ ...errors, price: undefined }); }}
                        style={{ borderColor: errors.price ? "#dc2626" : undefined }}
                    />
                    {errors.price && <span style={{ color: "#dc2626", fontSize: "12px", marginTop: "2px" }}>{errors.price}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="image">Menu Image (Optional)</label>
                    <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setImageFile(e.target.files[0]);
                                if (errors.image) setErrors({ ...errors, image: undefined });
                            }
                        }}
                        style={{ backgroundColor: "#fff", padding: "6px", borderColor: errors.image ? "#dc2626" : undefined }}
                    />
                    {errors.image && <span style={{ color: "#dc2626", fontSize: "12px", marginTop: "2px" }}>{errors.image}</span>}
                </div>

                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        rows={3}
                        placeholder="Short description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ backgroundColor: "#fff", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                    />
                </div>

                <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                    <button type="submit" disabled={submitting} className="btn-primary">
                        {submitting ? "Saving..." : editingMenu ? "Update Menu" : "Save Menu"}
                    </button>
                </div>
            </form>
        </div>
    );
}