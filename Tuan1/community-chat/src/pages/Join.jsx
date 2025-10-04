import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Join() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!name.trim()) return;
    localStorage.setItem("username", name);
    navigate("/chat");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleJoin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-blue-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-800 mb-2">Join TaZi Community Chat</h2>
          <p className="text-blue-600">Nhập tên hay biệt danh của bro để bắt đầu chat với mọi người.</p>
        </div>
        
        <div className="space-y-4">
          <input
            className="w-full border border-blue-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            placeholder="Nhập tên bro..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={handleJoin}
            className="w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-md"
          >
            Tham gia Chat
          </button>
        </div>
      </div>
    </div>
  );
}