import { useState } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMessage, deleteMessage, createReply, deleteReply, updateReply } from "../services/api";
import { useForm } from "react-hook-form";
import { useAuth } from "../stores/auth.store";

export default function MessageCard({ msg }) {
  const username = localStorage.getItem("username");
  const [editMode, setEditMode] = useState(false);
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [showAllReplies, setShowAllReplies] = useState(false);
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  // useMutation cho update message
  const { mutate: updateMessageMutation } = useMutation({
    mutationFn: ({ id, data }) => updateMessage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  // useMutation cho delete message
  const { mutate: deleteMessageMutation } = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  // useMutation cho create reply
  const { mutate: createReplyMutation } = useMutation({
    mutationFn: ({ messageId, reply }) => createReply(messageId, reply),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  // useMutation cho update reply
  const { mutate: updateReplyMutation } = useMutation({
    mutationFn: ({ messageId, replyId, updatedReply }) => 
      updateReply(messageId, replyId, updatedReply),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  // useMutation cho delete reply
  const { mutate: deleteReplyMutation } = useMutation({
    mutationFn: ({ messageId, replyId }) => deleteReply(messageId, replyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  // Forms
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

  const { 
    register: registerReply, 
    handleSubmit: handleReplySubmit, 
    formState: { errors: replyErrors, isSubmitting: isReplying },
    reset: resetReply
  } = useForm();

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
    
  // Format time
  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Message actions với mutations
  const onMessageEdit = async (data) => {
    updateMessageMutation({ id: msg.id, data: { ...msg, message: data.message } });
    setEditMode(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Xóa tin này??")) {
      deleteMessageMutation(msg.id);
    }
  };

  // Reply actions với mutations
  const onReplySubmit = async (data) => {
    createReplyMutation({ 
      messageId: msg.id, 
      reply: { username, message: data.reply } 
    });
    resetReply();
  };

  const handleDeleteReply = async (replyId) => {
    if (window.confirm("Xóa câu trả lời này?")) {
      deleteReplyMutation({ messageId: msg.id, replyId });
    }
  };

  const onReplyEdit = async (data) => {
    updateReplyMutation({ 
      messageId: msg.id, 
      replyId: editingReplyId, 
      updatedReply: { message: data.replyEdit } 
    });
    setEditingReplyId(null);
    resetReplyEdit();
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

  const messageAvatar = msg.avatar || (msg.username === currentUser?.username ? currentUser.avatar : null);
  const getReplyAvatar = (r) => r.avatar || (r.username === currentUser?.username ? currentUser.avatar : null);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-blue-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center space-x-2">
            {messageAvatar ? (
              <img
                src={messageAvatar}
                alt={msg.username}
                className="w-8 h-8 rounded-full object-cover bg-gray-200"
              />
            ) : (
              <span className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center font-bold">
                {msg.username?.charAt(0).toUpperCase()}
              </span>
            )}
            <strong className="text-blue-800 dark:text-blue-200">{msg.username}</strong>
            <span className="text-gray-500 dark:text-gray-400 text-sm ml-10">
              {formatTime(msg.createdAt)}
            </span>
          </div>
        </div>
        
        {username === msg.username && (
          <div className="flex space-x-2">
            {editMode ? (
              <button onClick={cancelEditMessage} className="text-gray-500 dark:text-gray-300 text-sm">
                Trở lại
              </button>
            ) : (
              <>
                <button onClick={startEditMessage} className="text-blue-500 dark:text-blue-300 text-sm">
                  Chỉnh sửa
                </button>
                <button onClick={handleDelete} className="text-red-400 dark:text-red-300 text-sm">
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
              className="w-full border border-blue-300 dark:border-gray-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-900 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{messageErrors.message.message}</p>
            )}
          </div>
          <button type="submit" className="bg-green-400 dark:bg-green-600 text-white py-2 px-4 rounded-xl">
            Lưu
          </button>
        </form>
      ) : (
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{msg.message}</p>
      )}

      {/* Replies */}
      {(msg.replies || []).length > 0 && (
        <div className="ml-4 mt-4 space-y-3 border-l-2 border-blue-200 dark:border-gray-600 pl-4">
          {displayedReplies.map((r) => (
            <div key={r.id} className="bg-blue-50 dark:bg-gray-700 rounded-xl p-3">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <div className="flex items-center space-x-2">
                    {getReplyAvatar(r) ? (
                      <img
                        src={getReplyAvatar(r)}
                        alt={r.username}
                        className="w-7 h-7 rounded-full object-cover bg-gray-200"
                      />
                    ) : (
                      <span className="w-7 h-7 rounded-full bg-blue-400 text-white flex items-center justify-center font-bold text-sm">
                        {r.username?.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <strong className="text-blue-700 dark:text-blue-200 text-sm">{r.username}</strong>
                    <span className="text-gray-500 dark:text-gray-400 text-xs ml-8">
                      {formatTime(r.createdAt)}
                    </span>
                  </div>
                </div>
                
                {username === r.username && (
                  <div className="flex space-x-2 text-xs">
                    {editingReplyId === r.id ? (
                      <>
                        <button type="submit" form={`reply-edit-form-${r.id}`} className="text-blue-500 dark:text-blue-300">
                          Lưu
                        </button>
                        <button onClick={cancelEdit} className="text-gray-500 dark:text-gray-300">
                          Trở lại
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditReply(r)} className="text-blue-500 dark:text-blue-300">
                          Chỉnh sửa
                        </button>
                        <button onClick={() => handleDeleteReply(r.id)} className="text-red-400 dark:text-red-300">
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
                    className="w-full border border-blue-300 dark:border-gray-600 rounded-lg p-2 text-sm focus:outline-none resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">{replyEditErrors.replyEdit.message}</p>
                  )}
                </form>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{r.message}</p>
              )}
            </div>
          ))}

          {/* Nút xem thêm */}
          {(msg.replies || []).length > 2 && (
            <button
              onClick={() => setShowAllReplies(!showAllReplies)}
              className="text-blue-500 dark:text-blue-300 text-sm hover:text-blue-700 dark:hover:text-blue-200"
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
            className="w-full border border-blue-300 dark:border-gray-600 rounded-xl p-3 text-sm focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
            <p className="text-red-500 dark:text-red-400 text-xs mt-1 ml-1">{replyErrors.reply.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isReplying}
          className="bg-blue-400 dark:bg-blue-600 text-white px-4 rounded-xl text-sm disabled:bg-blue-200 dark:disabled:bg-blue-900"
        >
          {isReplying ? "..." : "Trả lời"}
        </button>
      </form>
    </div>
  );
}