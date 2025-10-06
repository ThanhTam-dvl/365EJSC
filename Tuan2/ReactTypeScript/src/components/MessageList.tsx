// src/components/MessageList.tsx
import { useEffect, useState } from "react";
import { getMessages, Message } from "../api/api";

const MessageList = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMessages();
        setMessages(data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-3">📩 Danh sách tin nhắn</h2>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="border border-gray-300 rounded-xl p-3 mb-3 shadow-sm bg-white"
        >
          <div className="flex justify-between">
            <strong>{msg.username}</strong>
            <span className="text-sm text-gray-500">
              {new Date(msg.createdAt).toLocaleString("vi-VN")}
            </span>
          </div>
          <p className="mt-2">{msg.message}</p>

          {msg.replies && msg.replies.length > 0 && (
            <ul className="mt-2 pl-4 text-sm text-gray-600 list-disc">
              {msg.replies.map((rep, index) => (
                <li key={index}>{rep}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
