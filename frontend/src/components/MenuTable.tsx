import { useState } from "react";
import type { Menu } from "../types/menu";
import { deleteMenu } from "../api/menuApi";

interface Props {
    menus: Menu[];
    refresh: () => void;
    onEdit: (menu: Menu) => void;
}

export default function MenuTable({ menus, refresh, onEdit }: Props) {
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");

    const remove = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this menu item?")) {
            return;
        }

        try {
            setDeletingId(id);
            await deleteMenu(id);
            refresh();
        } catch (error) {
            console.error("Failed to delete menu item:", error);
            alert("Failed to delete the item. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const filteredMenus = menus.filter((menu) => {
        const matchesSearch =
            menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (menu.description && menu.description.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory =
            selectedCategory === "ALL" || menu.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="card-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                <h2 className="section-title" style={{ margin: 0 }}>Menu List</h2>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <input
                        type="text"
                        placeholder="Search by name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: "1px solid #d1d5db",
                            fontSize: "14px",
                            outline: "none",
                            minWidth: "220px",
                            backgroundColor: "#fff"
                        }}
                    />

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: "1px solid #d1d5db",
                            fontSize: "14px",
                            outline: "none",
                            backgroundColor: "#fff"
                        }}
                    >
                        <option value="ALL">All Categories</option>
                        <option value="Food">Food</option>
                        <option value="Drink">Drink</option>
                        <option value="Buffet">Buffet</option>
                        <option value="Dessert">Dessert</option>
                        <option value="Snack">Snack</option>
                    </select>
                </div>
            </div>

            {filteredMenus.length === 0 ? (
                <p className="empty-state">No matching menu items found.</p>
            ) : (
                <div className="table-responsive">
                    <table className="custom-table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {filteredMenus.map((menu) => (
                            <tr key={menu.id}>
                                <td className="font-semibold">{menu.name}</td>
                                <td style={{ color: "#6b7280", maxWidth: "250px" }}>
                                    {menu.description || "-"}
                                </td>
                                <td className="price-tag">
                                    ${Number(menu.price).toFixed(2)}
                                </td>
                                <td>
                    <span className="category-badge">
                      {menu.category || "General"}
                    </span>
                                </td>
                                <td style={{ textAlign: "right", display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                                    <button
                                        className="btn-danger-sm"
                                        style={{ backgroundColor: "#eef2ff", color: "#4f46e5", border: "1px solid #c7d2fe" }}
                                        onClick={() => onEdit(menu)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn-danger-sm"
                                        disabled={deletingId === menu.id}
                                        onClick={() => menu.id && remove(menu.id)}
                                    >
                                        {deletingId === menu.id ? "..." : "Delete"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}