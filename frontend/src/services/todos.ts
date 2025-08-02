import api from './api';
import { Todo, TodoCreate, TodoUpdate } from '../types';

export interface TodosSearchParams {
  search?: string;
  completed?: 'all' | 'completed' | 'pending';
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  skip?: number;
  limit?: number;
}

export interface TodosResponse {
  todos: Todo[];
  total: number;
  skip: number;
  limit: number;
}

export interface TodoAnalytics {
  total_todos: number;
  completed_todos: number;
  pending_todos: number;
  completion_rate: number;
}

export const todosService = {
  async getTodos(params?: TodosSearchParams): Promise<TodosResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.search) searchParams.append('search', params.search);
    if (params?.completed && params.completed !== 'all') {
      searchParams.append('completed', params.completed === 'completed' ? 'true' : 'false');
    }
    if (params?.sort_by) searchParams.append('sort_by', params.sort_by);
    if (params?.sort_order) searchParams.append('sort_order', params.sort_order);
    if (params?.skip !== undefined) searchParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.append('limit', params.limit.toString());

    const response = await api.get(`/todos/?${searchParams.toString()}`);
    return response.data;
  },

  async getTodo(id: number): Promise<Todo> {
    const response = await api.get(`/todos/${id}`);
    return response.data;
  },

  async createTodo(todo: TodoCreate): Promise<Todo> {
    const response = await api.post('/todos/', todo);
    return response.data;
  },

  async updateTodo(id: number, todo: TodoUpdate): Promise<Todo> {
    const response = await api.put(`/todos/${id}`, todo);
    return response.data;
  },

  async deleteTodo(id: number): Promise<void> {
    await api.delete(`/todos/${id}`);
  },

  async getAnalytics(): Promise<TodoAnalytics> {
    const response = await api.get('/todos/analytics');
    return response.data;
  },

  async exportTodos(format: 'json' | 'csv', params?: TodosSearchParams): Promise<Blob> {
    const searchParams = new URLSearchParams();
    
    if (params?.search) searchParams.append('search', params.search);
    if (params?.completed && params.completed !== 'all') {
      searchParams.append('completed', params.completed === 'completed' ? 'true' : 'false');
    }
    if (params?.sort_by) searchParams.append('sort_by', params.sort_by);
    if (params?.sort_order) searchParams.append('sort_order', params.sort_order);

    const response = await api.get(`/todos/export/${format}?${searchParams.toString()}`, {
      responseType: 'blob'
    });
    return response.data;
  },
}; 