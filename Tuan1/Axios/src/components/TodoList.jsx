import React from "react";
import TodoItem from "./TodoItem";

export default function TodoList({ todos, onToggle, onDelete }) {
  if (!todos || todos.length === 0) {
    return <div className="p-8 text-center text-gray-500">Chưa có todo nào. Thêm ngay!</div>;
  }

  return (
    <ul className="space-y-3">
      {todos.map(t => (
        <TodoItem key={t.id} todo={t} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
}
