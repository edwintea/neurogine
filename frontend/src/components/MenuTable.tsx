import { useState } from "react";
import type { Menu } from "../types/menu";
import { deleteMenu } from "../api/menuApi";

interface Props {
    menus: Menu[];
    refresh: () => void;
}

export default function MenuTable({ menus, refresh }: Props) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

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

    return (
        <div className="card-container">
            <h2 className="section-title">Menu List</h2>

            {menus.length === 0 ? (
                <p className="empty-state">No menu items found. Add your first item above!</p>
            ) : (
                <div className="table-responsive">
                    <table className="custom-table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th style={{ textAlign: "right" }}>Action</th>
                        </tr>
                        </thead>

                        <tbody>
                        {menus.map((menu) => (
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
                                <td style={{ textAlign: "right" }}>
                                    <button
                                        className="btn-danger-sm"
                                        disabled={deletingId === menu.id}
                                        onClick={() => menu.id && remove(menu.id)}
                                    >
                                        {deletingId === menu.id ? "Deleting..." : "Delete"}
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