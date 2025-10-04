import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Join from "./pages/Join";
import Chat from "./pages/Chat";
import About from "./pages/About";

function App() {

  return (
    <div className="min-h-screen bg-gray-50">

        <Navbar />
        <div className="p-4 max-w-3xl mx-auto">
          <Routes>
            <Route path="/" element={<Join />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </div>
      </div>
  );
}

export default App
