import React from "react";
import { Link } from "react-router-dom";

export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded shadow-sm">
      {/* Left: content */}
      <div className="flex-1 min-w-0">
        <div
          className={`text-lg font-medium truncate max-w-full ${
            todo.completed ? "line-through text-gray-400" : "text-gray-900"
          }`}
        >
          {todo.title}
        </div>

        {todo.description ? (
          <div className="text-sm text-gray-600 mt-1 break-words">
            {todo.description}
          </div>
        ) : null}
      </div>

      {/* Right: actions */}
      <div className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0 grid grid-cols-3 sm:flex gap-2 w-full sm:w-auto">
        <button
          onClick={() => onToggle(todo)}
          className={`px-2 py-1 rounded text-sm font-medium text-center ${
            todo.completed ? "bg-yellow-500 text-white" : "bg-green-600 text-white"
          }`}
        >
          {todo.completed ? "Undo" : "Done"}
        </button>

        <Link
          to={`/edit/${todo.id}`}
          className="px-2 py-1 bg-blue-600 text-white rounded text-sm text-center"
        >
          Edit
        </Link>

        <button
          onClick={() => onDelete(todo)}
          className="px-2 py-1 bg-red-600 text-white rounded text-sm text-center"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
