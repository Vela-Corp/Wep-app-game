import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Create from "./pages/Create";
import Main_lobby from "./pages/Main_lobby";
import Pk_Map from "./pages/Pk_Map";
import Detail_Hero from "./pages/Detail_Hero";
function App() {
  const user_info = JSON.parse(localStorage.getItem("dataFigure") || "{}");
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />}></Route>
          <Route path="/create" element={<Create />}></Route>
          <Route
            path="/main"
            element={user_info ? <Main_lobby /> : <Navigate to="/" />}
          ></Route>
          <Route path="/pk_map/:id" element={<Pk_Map />}></Route>
          <Route path="/detail-hero/:id" element={<Detail_Hero />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
