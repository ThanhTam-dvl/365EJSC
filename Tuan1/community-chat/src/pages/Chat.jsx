import { useEffect, useState } from "react";
import { getMessages, createMessage } from "../services/api";
import MessageCard from "../components/MessageCard";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const username = localStorage.getItem("username");

  const loadMessages = async () => {
    try {
      const res = await getMessages();
      setMessages(res.data);
    } catch (error) {
      console.error("Lỗi tải tin nhắn:", error);
    }
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      await createMessage({ username, message: text, replies: [] });
      setText("");
      loadMessages();
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pt-14 pb-32">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-blue-200">
          <h2 className="text-2xl font-bold text-blue-800 mb-2">
            Chào mừng, <span className="text-blue-600">{username}</span>
          </h2>
          <p className="text-blue-600">Bạn là một phần của community chat!</p>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-blue-200">
              <p className="text-blue-600 text-lg">Không có tin nhắn nào ở đây cả. Hãy bắt đầu với tin của bạn!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <MessageCard key={msg.id} msg={msg} refresh={loadMessages} />
            ))
          )}
        </div>
      </div>

      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-blue-200 p-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            className="flex-1 border border-blue-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            placeholder="Nhập tin nhắn..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 disabled:from-blue-200 disabled:to-blue-300 text-white font-semibold px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-md disabled:shadow-none"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}