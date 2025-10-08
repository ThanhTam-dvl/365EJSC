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

// Task 3: Tanstack Query
export const getStats = async () => {
  // Giả lập API stats
  const messagesRes = await getMessages();
  const messages = messagesRes.data;
  
  return {
    totalMessages: messages.length,
    totalReplies: messages.reduce((acc, msg) => acc + (msg.replies?.length || 0), 0),
    activeUsers: [...new Set(messages.map(msg => msg.username))].length,
    latestMessage: messages[0]?.createdAt || 'No messages'
  };
};

// NEW: Search API
export const searchMessages = async (searchTerm) => {
  const res = await getMessages();
  const messages = res.data;
  
  return messages.filter(msg => 
    msg.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

// NEW: User Messages API
export const getUserMessages = async (username) => {
  const res = await getMessages();
  const messages = res.data;
  
  return messages.filter(msg => msg.username === username);
};