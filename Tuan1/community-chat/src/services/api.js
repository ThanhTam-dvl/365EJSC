// services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://68df4c1b898434f413574b7d.mockapi.io",
});

// ==================== USER AUTHENTICATION API ====================

// Users API - Sử dụng MockAPI thực tế
export const getUsers = () => api.get("/users");
export const getUserById = (id) => api.get(`/users/${id}`);
export const createUser = (userData) => api.post("/users", {
  ...userData,
  createdAt: new Date().toISOString(),
  avatar: userData.avatar || '',
});
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Authentication functions
export const findUserByLogin = async (loginUsername) => {
  try {
    const res = await getUsers();
    const users = res.data;
    return users.find(user => user.loginUsername === loginUsername);
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
};

export const findUserByUsername = async (username) => {
  try {
    const res = await getUsers();
    const users = res.data;
    return users.find(user => user.username === username);
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
};

export const authenticateUser = async (loginUsername, password) => {
  try {
    const user = await findUserByLogin(loginUsername);
    if (user && user.password === password) {
      const { password: _, ...userWithoutPassword } = user;
      return { success: true, user: userWithoutPassword };
    }
    return { success: false, error: 'Tên đăng nhập hoặc mật khẩu không đúng' };
  } catch (error) {
    return { success: false, error: 'Lỗi kết nối, vui lòng thử lại' };
  }
};

// Check if username already exists
export const checkUsernameExists = async (username) => {
  try {
    const user = await findUserByUsername(username);
    return !!user;
  } catch (error) {
    return false;
  }
};

// Check if loginUsername already exists
export const checkLoginUsernameExists = async (loginUsername) => {
  try {
    const user = await findUserByLogin(loginUsername);
    return !!user;
  } catch (error) {
    return false;
  }
};

// Update user password
export const updateUserPassword = async (userId, newPassword) => {
  try {
    const { data: currentUser } = await getUserById(userId);
    return await updateUser(userId, { ...currentUser, password: newPassword });
  } catch (error) {
    throw new Error('Failed to update password');
  }
};

// ==================== MESSAGES API ====================

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

export const getStats = async () => {
  const messagesRes = await getMessages();
  const messages = messagesRes.data;
  
  return {
    totalMessages: messages.length,
    totalReplies: messages.reduce((acc, msg) => acc + (msg.replies?.length || 0), 0),
    activeUsers: [...new Set(messages.map(msg => msg.username))].length,
    latestMessage: messages[0]?.createdAt || 'No messages'
  };
};

export const searchMessages = async (searchTerm) => {
  const res = await getMessages();
  const messages = res.data;
  
  return messages.filter(msg => 
    msg.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const getUserMessages = async (username) => {
  const res = await getMessages();
  const messages = res.data;
  
  return messages.filter(msg => msg.username === username);
};