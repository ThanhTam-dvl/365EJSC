import { useEffect, useState } from "react";
import { getTodos, deleteTodo, updateTodo } from "../services/todoService";
import TodoList from "../components/TodoList";

export default function Home() {
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    const res = await getTodos();
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleDelete = async (todo) => {
    await deleteTodo(todo.id);
    fetchTodos();
  };

  const toggleStatus = async (todo) => {
    await updateTodo(todo.id, { ...todo, completed: !todo.completed });
    fetchTodos();
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4">
      <h2 className="text-2xl font-semibold mb-4">Todo List</h2>
      <TodoList todos={todos} onToggle={toggleStatus} onDelete={handleDelete} />
    </div>
  );
}
