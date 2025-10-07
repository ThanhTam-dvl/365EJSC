import { useEffect, useState } from "react";
import { getMessages, createMessage } from "../services/api";
import MessageCard from "../components/MessageCard";
import { useForm } from "react-hook-form";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const username = localStorage.getItem("username");

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset,
    watch 
  } = useForm({
    mode: "onChange"
  });

  const messageText = watch("message", "");

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

  const onSubmit = async (data) => {
    try {
      await createMessage({ username, message: data.message, replies: [] });
      reset();
      loadMessages();
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
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
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
            <div className="flex-1">
              <input
                className="w-full border border-blue-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                placeholder="Nhập tin nhắn..."
                {...register("message", {
                  required: "Tin nhắn không được để trống",
                  minLength: {
                    value: 1,
                    message: "Tin nhắn phải có ít nhất 1 ký tự"
                  },
                  maxLength: {
                    value: 1000,
                    message: "Tin nhắn không được quá 1000 ký tự"
                  }
                })}
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1 ml-1">{errors.message.message}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || !messageText.trim()}
              className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 disabled:from-blue-200 disabled:to-blue-300 text-white font-semibold px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-md disabled:shadow-none"
            >
              {isSubmitting ? "..." : "Gửi"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}