import React, { useId } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus } from 'lucide-react';
import { TodoCreate } from '../types';

const todoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

type TodoFormData = z.infer<typeof todoSchema>;

interface TodoFormProps {
  onSubmit: (data: TodoCreate) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const TodoFormA11y: React.FC<TodoFormProps> = ({ onSubmit, onCancel, isLoading }) => {
  const titleId = useId();
  const descriptionId = useId();
  const titleErrorId = useId();
  const descriptionErrorId = useId();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
  });

  const handleFormSubmit = (data: TodoFormData) => {
    onSubmit({
      title: data.title,
      description: data.description || undefined,
    });
  };

  return (
    <div className="card" role="form" aria-labelledby="form-title">
      <div className="flex justify-between items-center mb-4">
        <h2 id="form-title" className="text-lg font-semibold">
          Add New Todo
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
          aria-label="Close form"
          type="button"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor={titleId} className="block text-sm font-medium text-gray-700">
            Title <span className="text-red-500" aria-label="required">*</span>
          </label>
          <input
            {...register('title')}
            id={titleId}
            type="text"
            className={`input mt-1 ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Enter todo title"
            aria-describedby={errors.title ? titleErrorId : undefined}
            aria-invalid={errors.title ? 'true' : 'false'}
            aria-required="true"
          />
          {errors.title && (
            <p id={titleErrorId} className="mt-1 text-sm text-red-600" role="alert">
              {errors.title.message}
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor={descriptionId} className="block text-sm font-medium text-gray-700">
            Description <span className="text-gray-500">(Optional)</span>
          </label>
          <textarea
            {...register('description')}
            id={descriptionId}
            className={`input mt-1 ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
            rows={3}
            placeholder="Enter todo description"
            aria-describedby={errors.description ? descriptionErrorId : undefined}
            aria-invalid={errors.description ? 'true' : 'false'}
          />
          {errors.description && (
            <p id={descriptionErrorId} className="mt-1 text-sm text-red-600" role="alert">
              {errors.description.message}
            </p>
          )}
        </div>
        
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-describedby={isLoading ? 'loading-status' : undefined}
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>{isLoading ? 'Adding...' : 'Add Todo'}</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
        
        {isLoading && (
          <div id="loading-status" className="sr-only" aria-live="polite">
            Adding todo, please wait...
          </div>
        )}
      </form>
    </div>
  );
};

export default TodoFormA11y; 