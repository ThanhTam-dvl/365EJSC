import axios from "axios";

// Định nghĩa kiểu dữ liệu Message
export interface Message {
  id: string;
  username: string;
  message: string;
  replies: string[];
  createdAt: string;
}

// Cấu hình axios instance
const api = axios.create({
  baseURL: "https://68df4c1b898434f413574b7d.mockapi.io",
});

// Lấy danh sách tin nhắn (sắp xếp theo createdAt giảm dần)
export const getMessages = async (): Promise<Message[]> => {
  const res = await api.get<Message[]>("/messages?sortBy=createdAt&order=desc");
  return res.data;
};

// Tạo mới tin nhắn
export const createMessage = async (
  data: Omit<Message, "id" | "createdAt">
): Promise<Message> => {
  const res = await api.post<Message>("/messages", {
    ...data,
    createdAt: new Date().toISOString(),
  });
  return res.data;
};

// Cập nhật tin nhắn
export const updateMessage = async (
  id: string,
  data: Partial<Message>
): Promise<Message> => {
  const res = await api.put<Message>(`/messages/${id}`, data);
  return res.data;
};

// Xóa tin nhắn
export const deleteMessage = async (id: string): Promise<void> => {
  await api.delete(`/messages/${id}`);
};
