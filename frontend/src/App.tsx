import { useEffect, useState } from "react";

import MenuForm from "./components/MenuForm";
import MenuTable from "./components/MenuTable";

import { getMenus } from "./api/menuApi";
import type {Menu} from "./types/menu";

function App() {
  const [menus, setMenus] = useState<
      Menu[]
  >([]);

  const loadMenus = async () => {
    const data = await getMenus();
    setMenus(data);
  };

  useEffect(() => {
    loadMenus();
  }, []);

  return (
      <div
          style={{
            padding: 20,
          }}
      >
        <h1>
          Menu Management System
        </h1>

        <MenuForm
            onSuccess={loadMenus}
        />

        <hr />

        <MenuTable
            menus={menus}
            refresh={loadMenus}
        />
      </div>
  );
}

export default App;