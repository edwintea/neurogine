import { useEffect, useState } from "react";

import MenuForm from "./components/MenuForm";
import MenuTable from "./components/MenuTable";

import { getMenus } from "./api/menuApi";
import type { Menu } from "./types/menu";

import "./App.css";

function App() {
  const [menus, setMenus] = useState<Menu[]>([]);

  const loadMenus = async () => {
    const data = await getMenus();
    setMenus(data);
  };

  useEffect(() => {
    loadMenus();
  }, []);

  return (
      <div id="center">
        {/* Header & Counter Badge from your CSS */}
        <header style={{ textAlign: "center" }}>
          <h1>Menu Management System</h1>
          <div className="counter">
            Total Items: {menus.length}
          </div>
        </header>

        {/* Main Content Container */}
        <main style={{ width: "100%", maxWidth: "800px", padding: "0 20px" }}>
          <MenuForm onSuccess={loadMenus} />

          {/* Visual Spacer matching your CSS */}
          <div id="spacer" />

          <MenuTable menus={menus} refresh={loadMenus} />
        </main>
      </div>
  );
}

export default App;