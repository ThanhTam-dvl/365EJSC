import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTodo, getTodo, updateTodo } from "../services/todoService";

export default function AddEditTodo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");

  // Load dữ liệu khi edit
  useEffect(() => {
    if (id) {
      getTodo(id).then(res => setTitle(res.data.title));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await updateTodo(id, { title, completed: false });
    } else {
      await createTodo({ title, completed: false });
    }
    navigate("/");
  };

  return (
    <div className="container mx-auto mt-6 max-w-md bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">{id ? "Edit Todo" : "Add Todo"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter todo title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded text-white ${id ? "bg-blue-500" : "bg-green-500"}`}
          >
            {id ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
