import { useState } from "react";
import { createMenu } from "../api/menuApi";

interface Props {
    onSuccess: () => void;
}

export default function MenuForm({
                                     onSuccess,
                                 }: Props) {
    const [name, setName] = useState("");
    const [description, setDescription] =
        useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] =
        useState("");

    const submit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        await createMenu({
            name,
            description,
            price: Number(price),
            category,
        });

        setName("");
        setDescription("");
        setPrice("");
        setCategory("");

        onSuccess();
    };

    return (
        <form onSubmit={submit}>
            <h2>Create Menu</h2>

            <input
                placeholder="Name"
                value={name}
                onChange={(e) =>
                    setName(e.target.value)
                }
            />

            <input
                placeholder="Description"
                value={description}
                onChange={(e) =>
                    setDescription(e.target.value)
                }
            />

            <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) =>
                    setPrice(e.target.value)
                }
            />

            <input
                placeholder="Category"
                value={category}
                onChange={(e) =>
                    setCategory(e.target.value)
                }
            />

            <button type="submit">
                Save
            </button>
        </form>
    );
}