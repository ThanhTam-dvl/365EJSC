import axios from "axios";

const api = axios.create({
  baseURL: "https://68df4c1b898434f413574b7d.mockapi.io",
});

export const getMessages = () => api.get("/messages?sortBy=createdAt&order=desc");
export const createMessage = (data) => api.post("/messages", {
  ...data,
  createdAt: new Date().toISOString()
});
export const updateMessage = (id, data) => api.put(`/messages/${id}`, data);
export const deleteMessage = (id) => api.delete(`/messages/${id}`);

export const createReply = async (messageId, reply) => {
  const { data: currentMessage } = await api.get(`/messages/${messageId}`);
  const newReply = { 
    ...reply,
    id: Date.now(), 
    createdAt: new Date().toISOString()
  };
  const currentReplies = Array.isArray(currentMessage.replies) ? currentMessage.replies : [];
  const updatedReplies = [...currentReplies, newReply];
  return api.put(`/messages/${messageId}`, { 
    ...currentMessage,
    replies: updatedReplies 
  });
};

export const deleteReply = async (messageId, replyId) => {
  const { data: currentMessage } = await api.get(`/messages/${messageId}`);
  const currentReplies = Array.isArray(currentMessage.replies) ? currentMessage.replies : [];
  const updatedReplies = currentReplies.filter(reply => reply.id !== replyId);
  return api.put(`/messages/${messageId}`, { 
    ...currentMessage,
    replies: updatedReplies 
  });
};

export const updateReply = async (messageId, replyId, updatedReply) => {
  const { data: currentMessage } = await api.get(`/messages/${messageId}`);
  const currentReplies = Array.isArray(currentMessage.replies) ? currentMessage.replies : [];
  const updatedReplies = currentReplies.map(reply =>
    reply.id === replyId ? { ...reply, ...updatedReply } : reply
  );
  return api.put(`/messages/${messageId}`, { 
    ...currentMessage,
    replies: updatedReplies 
  });
};