import { useState } from "react";
import { updateMessage, deleteMessage, createReply, deleteReply, updateReply } from "../services/api";
import { useForm } from "react-hook-form";

export default function MessageCard({ msg, refresh }) {
  const username = localStorage.getItem("username");
  const [editMode, setEditMode] = useState(false);
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [showAllReplies, setShowAllReplies] = useState(false);

  // Form cho message edit
  const { 
    register: registerMessage, 
    handleSubmit: handleMessageSubmit, 
    formState: { errors: messageErrors },
    setValue: setMessageValue
  } = useForm({
    defaultValues: {
      message: msg.message
    }
  });

  // Form cho reply
  const { 
    register: registerReply, 
    handleSubmit: handleReplySubmit, 
    formState: { errors: replyErrors, isSubmitting: isReplying },
    reset: resetReply
  } = useForm();

  // Form cho reply edit
  const { 
    register: registerReplyEdit, 
    handleSubmit: handleReplyEditSubmit, 
    formState: { errors: replyEditErrors },
    setValue: setReplyEditValue,
    reset: resetReplyEdit
  } = useForm();

  // Hiển thị replies
  const displayedReplies = showAllReplies 
    ? msg.replies 
    : (msg.replies || []).slice(0, 2);
    
  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const onMessageEdit = async (data) => {
    await updateMessage(msg.id, { ...msg, message: data.message });
    setEditMode(false);
    refresh();
  };

  const handleDelete = async () => {
    if (window.confirm("Xóa tin này??")) {
      await deleteMessage(msg.id);
      refresh();
    }
  };

  const onReplySubmit = async (data) => {
    await createReply(msg.id, { username, message: data.reply });
    resetReply();
    refresh();
  };

  const handleDeleteReply = async (replyId) => {
    if (window.confirm("Xóa câu trả lời này?")) {
      await deleteReply(msg.id, replyId);
      refresh();
    }
  };

  const onReplyEdit = async (data) => {
    await updateReply(msg.id, editingReplyId, { message: data.replyEdit });
    setEditingReplyId(null);
    resetReplyEdit();
    refresh();
  };

  const handleEditReply = (reply) => {
    setEditingReplyId(reply.id);
    setReplyEditValue("replyEdit", reply.message);
  };

  const cancelEdit = () => {
    setEditingReplyId(null);
    resetReplyEdit();
  };

  const startEditMessage = () => {
    setEditMode(true);
    setMessageValue("message", msg.message);
  };

  const cancelEditMessage = () => {
    setEditMode(false);
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
            {editMode ? (
              <button onClick={cancelEditMessage} className="text-gray-500 text-sm">
                Trở lại
              </button>
            ) : (
              <>
                <button onClick={startEditMessage} className="text-blue-500 text-sm">
                  Chỉnh sửa
                </button>
                <button onClick={handleDelete} className="text-red-400 text-sm">
                  Xóa
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Message Content */}
      {editMode ? (
        <form onSubmit={handleMessageSubmit(onMessageEdit)} className="space-y-2">
          <div>
            <textarea
              className="w-full border border-blue-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              rows="3"
              {...registerMessage("message", {
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
            {messageErrors.message && (
              <p className="text-red-500 text-sm mt-1">{messageErrors.message.message}</p>
            )}
          </div>
          <button type="submit" className="bg-green-400 text-white py-2 px-4 rounded-xl">
            Lưu
          </button>
        </form>
      ) : (
        <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
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
                    {editingReplyId === r.id ? (
                      <>
                        <button type="submit" form={`reply-edit-form-${r.id}`} className="text-blue-500">
                          Lưu
                        </button>
                        <button onClick={cancelEdit} className="text-gray-500">
                          Trở lại
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditReply(r)} className="text-blue-500">
                          Chỉnh sửa
                        </button>
                        <button onClick={() => handleDeleteReply(r.id)} className="text-red-400">
                          Xóa
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {editingReplyId === r.id ? (
                <form 
                  id={`reply-edit-form-${r.id}`}
                  onSubmit={handleReplyEditSubmit(onReplyEdit)} 
                  className="space-y-2"
                >
                  <textarea
                    className="w-full border border-blue-300 rounded-lg p-2 text-sm focus:outline-none resize-none"
                    rows="2"
                    {...registerReplyEdit("replyEdit", {
                      required: "Reply không được để trống",
                      minLength: {
                        value: 1,
                        message: "Reply phải có ít nhất 1 ký tự"
                      },
                      maxLength: {
                        value: 500,
                        message: "Reply không được quá 500 ký tự"
                      }
                    })}
                  />
                  {replyEditErrors.replyEdit && (
                    <p className="text-red-500 text-xs mt-1">{replyEditErrors.replyEdit.message}</p>
                  )}
                </form>
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
      <form onSubmit={handleReplySubmit(onReplySubmit)} className="mt-4 flex space-x-2">
        <div className="flex-1">
          <input
            className="w-full border border-blue-300 rounded-xl p-3 text-sm focus:outline-none"
            placeholder="Viết câu trả lời..."
            {...registerReply("reply", {
              required: "Reply không được để trống",
              minLength: {
                value: 1,
                message: "Reply phải có ít nhất 1 ký tự"
              },
              maxLength: {
                value: 500,
                message: "Reply không được quá 500 ký tự"
              }
            })}
          />
          {replyErrors.reply && (
            <p className="text-red-500 text-xs mt-1 ml-1">{replyErrors.reply.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isReplying}
          className="bg-blue-400 text-white px-4 rounded-xl text-sm disabled:bg-blue-200"
        >
          {isReplying ? "..." : "Trả lời"}
        </button>
      </form>
    </div>
  );
}