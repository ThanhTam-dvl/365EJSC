import React, { useEffect, useState } from "react";

const STATUS = ["todo", "in-progress", "done"];

export default function TaskForm({ onAdd, onUpdate, editingTask, onCancel }) {
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("todo");

  useEffect(() => {
    if (editingTask) {
      setUsername(editingTask.username || "");
      setTitle(editingTask.title || "");
      setStatus(editingTask.status || "todo");
    } else {
      setUsername("");
      setTitle("");
      setStatus("todo");
    }
  }, [editingTask]);

  const submit = (e) => {
    e.preventDefault();
    if (!username.trim() || !title.trim()) {
      alert("Nhập tên người dùng và tên task");
      return;
    }
    const payload = { username: username.trim(), title: title.trim(), status };
    if (editingTask) {
      onUpdate(editingTask.id, payload);
    } else {
      onAdd(payload);
      setUsername(""); setTitle(""); setStatus("todo");
    }
  };

  return (
    <form onSubmit={submit}>
      <h3 className="text-lg font-medium mb-3">{editingTask ? "Chỉnh sửa Task" : "Tạo Task mới"}</h3>

      <label className="block text-sm">Người tạo</label>
      <input className="border rounded p-2 w-full mb-3" value={username} onChange={e=>setUsername(e.target.value)} />

      <label className="block text-sm">Tên Task</label>
      <input className="border rounded p-2 w-full mb-3" value={title} onChange={e=>setTitle(e.target.value)} />

      <label className="block text-sm">Tiến độ</label>
      <select className="border rounded p-2 w-full mb-4" value={status} onChange={e=>setStatus(e.target.value)}>
        {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <div className="flex gap-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          {editingTask ? "Cập nhật" : "Thêm"}
        </button>
        {editingTask && (
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">Hủy</button>
        )}
      </div>
    </form>
  );
}
