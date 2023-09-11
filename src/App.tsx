import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Create from "./pages/Create"
import Main_lobby from "./pages/Main_lobby"
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />}></Route>
          <Route path="/create" element={<Create />}></Route>
          <Route path="/main" element={<Main_lobby />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
