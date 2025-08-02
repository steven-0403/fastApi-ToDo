import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todosService, TodosSearchParams } from '../services/todos';
import { TodoUpdate } from '../types';
import toast from 'react-hot-toast';

export const useTodos = (params?: TodosSearchParams) => {
  const queryClient = useQueryClient();

  const todosQuery = useQuery({
    queryKey: ['todos', params],
    queryFn: () => todosService.getTodos(params),
  });

  const analyticsQuery = useQuery({
    queryKey: ['todos-analytics'],
    queryFn: todosService.getAnalytics,
  });

  const createTodoMutation = useMutation({
    mutationFn: todosService.createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todos-analytics'] });
      toast.success('Todo created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create todo');
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TodoUpdate }) =>
      todosService.updateTodo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todos-analytics'] });
      toast.success('Todo updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update todo');
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: todosService.deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todos-analytics'] });
      toast.success('Todo deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to delete todo');
    },
  });

  const exportTodosMutation = useMutation({
    mutationFn: ({ format, params }: { format: 'json' | 'csv'; params?: TodosSearchParams }) =>
      todosService.exportTodos(format, params),
    onSuccess: (blob, { format }) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `todos.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Todos exported as ${format.toUpperCase()}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to export todos');
    },
  });

  return {
    todos: todosQuery.data?.todos || [],
    totalTodos: todosQuery.data?.total || 0,
    analytics: analyticsQuery.data,
    isLoading: todosQuery.isPending,
    isAnalyticsLoading: analyticsQuery.isPending,
    error: todosQuery.error,
    createTodo: createTodoMutation.mutate,
    updateTodo: updateTodoMutation.mutate,
    deleteTodo: deleteTodoMutation.mutate,
    exportTodos: exportTodosMutation.mutate,
    isCreating: createTodoMutation.isPending,
    isUpdating: updateTodoMutation.isPending,
    isDeleting: deleteTodoMutation.isPending,
    isExporting: exportTodosMutation.isPending,
  };
}; 