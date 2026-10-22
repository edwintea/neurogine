import type {Menu} from "../types/menu";
import { deleteMenu } from "../api/menuApi";

interface Props {
    menus: Menu[];
    refresh: () => void;
}

export default function MenuTable({
                                      menus,
                                      refresh,
                                  }: Props) {
    const remove = async (
        id: string
    ) => {
        await deleteMenu(id);
        refresh();
    };

    return (
        <table border={1}>
            <thead>
            <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Category</th>
                <th>Action</th>
            </tr>
            </thead>

            <tbody>
            {menus.map((menu) => (
                <tr key={menu.id}>
                    <td>{menu.name}</td>
                    <td>{menu.description}</td>
                    <td>{menu.price}</td>
                    <td>{menu.category}</td>
                    <td>
                        <button
                            onClick={() =>
                                remove(menu.id!)
                            }
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}