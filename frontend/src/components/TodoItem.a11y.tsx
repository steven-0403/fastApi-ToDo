import React, { useState, useId } from 'react';
import { X, Edit2, Trash2, Save } from 'lucide-react';
import { Todo, TodoUpdate } from '../types';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (update: TodoUpdate) => void;
  onDelete: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

const TodoItemA11y: React.FC<TodoItemProps> = ({
  todo,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  
  const titleId = useId();
  const descriptionId = useId();
  const editFormId = useId();
  const checkboxId = useId();

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

  const handleEdit = () => {
    setIsEditing(true);
    // Focus management - focus on title input after state update
    setTimeout(() => {
      const titleInput = document.getElementById(titleId);
      titleInput?.focus();
    }, 0);
  };

  return (
    <article 
      className="card" 
      role="region"
      aria-labelledby={`todo-title-${todo.id}`}
      aria-describedby={`todo-meta-${todo.id}`}
    >
      <div className="flex items-start space-x-3">
        {/* Proper checkbox for todo completion */}
        <div className="flex items-center">
          <input
            id={checkboxId}
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggleComplete}
            disabled={isUpdating}
            className="h-5 w-5 rounded border-2 border-gray-300 text-green-600 focus:ring-green-500 focus:ring-2 focus:ring-offset-2"
            aria-describedby={`todo-title-${todo.id}`}
          />
          <label htmlFor={checkboxId} className="sr-only">
            Mark "{todo.title}" as {todo.completed ? 'incomplete' : 'complete'}
          </label>
        </div>

        <div className="flex-grow">
          {isEditing ? (
            <form 
              id={editFormId}
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-2"
              aria-labelledby={`edit-form-title-${todo.id}`}
            >
              <h3 id={`edit-form-title-${todo.id}`} className="sr-only">
                Edit todo: {todo.title}
              </h3>
              
              <div>
                <label htmlFor={titleId} className="sr-only">
                  Todo title
                </label>
                <input
                  id={titleId}
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="input"
                  placeholder="Title"
                  aria-required="true"
                  aria-invalid={!editTitle.trim() ? 'true' : 'false'}
                />
              </div>
              
              <div>
                <label htmlFor={descriptionId} className="sr-only">
                  Todo description
                </label>
                <textarea
                  id={descriptionId}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="input"
                  placeholder="Description"
                  rows={2}
                />
              </div>
              
              <div className="flex space-x-2" role="group" aria-label="Edit actions">
                <button
                  type="submit"
                  disabled={!editTitle.trim() || isUpdating}
                  className="btn btn-primary flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-describedby={isUpdating ? 'update-status' : undefined}
                >
                  <Save className="w-4 h-4" aria-hidden="true" />
                  <span>{isUpdating ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  disabled={isUpdating}
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          ) : (
            <div>
              <h3
                id={`todo-title-${todo.id}`}
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
              <p id={`todo-meta-${todo.id}`} className="mt-2 text-xs text-gray-400">
                <span className="sr-only">Created on </span>
                {new Date(todo.created_at).toLocaleDateString()}
                <span className="sr-only">
                  , Status: {todo.completed ? 'Completed' : 'Pending'}
                </span>
              </p>
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="flex space-x-2" role="group" aria-label="Todo actions">
            <button
              onClick={handleEdit}
              disabled={isUpdating || isDeleting}
              className="text-blue-600 hover:text-blue-800 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={`Edit todo: ${todo.title}`}
            >
              <Edit2 className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              onClick={onDelete}
              disabled={isUpdating || isDeleting}
              className="text-red-600 hover:text-red-800 p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label={`Delete todo: ${todo.title}`}
              aria-describedby={isDeleting ? 'delete-status' : undefined}
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
      
      {/* Live region for status updates */}
      {isUpdating && (
        <div id="update-status" className="sr-only" aria-live="polite">
          Updating todo, please wait...
        </div>
      )}
      
      {isDeleting && (
        <div id="delete-status" className="sr-only" aria-live="polite">
          Deleting todo, please wait...
        </div>
      )}
    </article>
  );
};

export default TodoItemA11y; 