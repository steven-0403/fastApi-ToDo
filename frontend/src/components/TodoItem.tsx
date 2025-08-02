import React, { useState } from 'react';
import { Check, X, Edit2, Trash2, Save } from 'lucide-react';
import { Todo, TodoUpdate } from '../types';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (update: TodoUpdate) => void;
  onDelete: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');

  const handleSave = () => {
    onUpdate({
      title: editTitle,
      description: editDescription,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditing(false);
  };

  const handleToggleComplete = () => {
    onUpdate({ completed: !todo.completed });
  };

  return (
    <div className="card">
      <div className="flex items-start space-x-3">
        <button
          onClick={handleToggleComplete}
          disabled={isUpdating}
          className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
            todo.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-green-500'
          }`}
        >
          {todo.completed && <Check className="w-3 h-3" />}
        </button>

        <div className="flex-grow">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="input"
                placeholder="Title"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="input"
                placeholder="Description"
                rows={2}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={!editTitle.trim() || isUpdating}
                  className="btn btn-primary flex items-center space-x-1"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="btn btn-secondary flex items-center space-x-1"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3
                className={`font-medium ${
                  todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                }`}
              >
                {todo.title}
              </h3>
              {todo.description && (
                <p
                  className={`mt-1 text-sm ${
                    todo.completed ? 'line-through text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {todo.description}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-400">
                Created: {new Date(todo.created_at).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              disabled={isUpdating || isDeleting}
              className="text-blue-600 hover:text-blue-800 p-1"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              disabled={isUpdating || isDeleting}
              className="text-red-600 hover:text-red-800 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoItem; 