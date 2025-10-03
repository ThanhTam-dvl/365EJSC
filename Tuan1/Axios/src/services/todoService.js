import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://jsonplaceholder.typicode.com", 
});

export const getTodos = () => api.get("/todo");
export const getTodo = (id) => api.get(`/todo/${id}`);
export const createTodo = (data) => api.post("/todo", data);
export const updateTodo = (id, data) => api.put(`/todo/${id}`, data);
export const deleteTodo = (id) => api.delete(`/todo/${id}`);
