import { useState } from "react";
import { updateMessage, deleteMessage, createReply, deleteReply, updateReply } from "../services/api";

export default function MessageCard({ msg, refresh }) {
  const username = localStorage.getItem("username");
  const [replyText, setReplyText] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(msg.message);
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editReplyText, setEditReplyText] = useState("");
  const [showAllReplies, setShowAllReplies] = useState(false);

  // Hiển thị replies
    const displayedReplies = showAllReplies 
      ? msg.replies 
      : (msg.replies || []).slice(0, 2);
      
  // Format time
  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  

  // Message actions
  const handleEdit = async () => {
    await updateMessage(msg.id, { ...msg, message: editText });
    setEditMode(false);
    refresh();
  };

  const handleDelete = async () => {
    if (window.confirm("Xóa tin này??")) {
      await deleteMessage(msg.id);
      refresh();
    }
  };

  // Reply actions
  const handleReply = async () => {
    if (!replyText.trim()) return;
    await createReply(msg.id, { username, message: replyText });
    setReplyText("");
    refresh();
  };

  const handleDeleteReply = async (replyId) => {
    if (window.confirm("Xóa câu trả lời này?")) {
      await deleteReply(msg.id, replyId);
      refresh();
    }
  };

  const handleEditReply = async (replyId) => {
    if (editingReplyId === replyId) {
      await updateReply(msg.id, replyId, { message: editReplyText });
      setEditingReplyId(null);
      setEditReplyText("");
      refresh();
    } else {
      const reply = msg.replies?.find(r => r.id === replyId);
      setEditingReplyId(replyId);
      setEditReplyText(reply?.message || "");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-blue-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center space-x-2">
            <strong className="text-blue-800">{msg.username}</strong>
            <span className="text-gray-500 text-sm ml-10">
            {formatTime(msg.createdAt)}
          </span>
          </div>
          
        </div>
        
        {username === msg.username && (
          <div className="flex space-x-2">
            <button onClick={() => setEditMode(!editMode)} className="text-blue-500 text-sm">
              {editMode ? "Trở lại" : "Chỉnh sửa"}
            </button>
            <button onClick={handleDelete} className="text-red-400 text-sm">
              Xóa
            </button>
          </div>
        )}
      </div>

      {/* Message Content */}
      {editMode ? (
        <div className="space-y-2">
          <textarea
            className="w-full border border-blue-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows="3"
          />
          <button onClick={handleEdit} className="bg-green-400 text-white py-2 px-4 rounded-xl">
            Lưu
          </button>
        </div>
      ) : (
        <p className="text-gray-700">{msg.message}</p>
      )}

      {/* Replies */}
      {(msg.replies || []).length > 0 && (
        <div className="ml-4 mt-4 space-y-3 border-l-2 border-blue-200 pl-4">
          {displayedReplies.map((r) => (
            <div key={r.id} className="bg-blue-50 rounded-xl p-3">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <div className="flex items-center space-x-2">
                    <strong className="text-blue-700 text-sm">{r.username}</strong>
                    <span className="text-gray-500 text-xs ml-8">
                      {formatTime(r.createdAt)}
                    </span>
                  </div>
                </div>
                
                {username === r.username && (
                  <div className="flex space-x-2 text-xs">
                    <button 
                      onClick={() => handleEditReply(r.id)}
                      className="text-blue-500"
                    >
                      {editingReplyId === r.id ? "Lưu" : "Chỉnh sửa"}
                    </button>
                    {editingReplyId === r.id ? (
                      <button onClick={() => setEditingReplyId(null)} className="text-gray-500">
                        Trở lại
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleDeleteReply(r.id)}
                        className="text-red-400"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                )}
              </div>

              {editingReplyId === r.id ? (
                <textarea
                  className="w-full border border-blue-300 rounded-lg p-2 text-sm focus:outline-none resize-none"
                  value={editReplyText}
                  onChange={(e) => setEditReplyText(e.target.value)}
                  rows="2"
                />
              ) : (
                <p className="text-gray-600 text-sm mt-1">{r.message}</p>
              )}
            </div>
          ))}

          {/* Nút xem thêm */}
          {(msg.replies || []).length > 2 && (
            <button
              onClick={() => setShowAllReplies(!showAllReplies)}
              className="text-blue-500 text-sm hover:text-blue-700"
            >
              {showAllReplies ? 'Ẩn bớt' : `Xem thêm ${(msg.replies || []).length - 2} reply`}
            </button>
          )}
        </div>
      )}

      {/* Reply Form */}
      <div className="mt-4 flex space-x-2">
        <input
          className="flex-1 border border-blue-300 rounded-xl p-3 text-sm focus:outline-none"
          placeholder="Viết câu trả lời..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleReply()}
        />
        <button
          onClick={handleReply}
          disabled={!replyText.trim()}
          className="bg-blue-400 text-white px-4 rounded-xl text-sm disabled:bg-blue-200"
        >
          Trả lời
        </button>
      </div>
    </div>
  );
}