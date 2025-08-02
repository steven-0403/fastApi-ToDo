import React from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTodos } from '../hooks/useTodos';
import { TodosSearchParams } from '../services/todos';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';
import SearchBar from '../components/SearchBar';
import Analytics from '../components/Analytics';
import { Todo, TodoCreate, TodoUpdate } from '../types';

const TodosPage: React.FC = () => {
  const [showForm, setShowForm] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchParams, setSearchParams] = React.useState<TodosSearchParams>({
    search: '',
    completed: 'all',
    sort_by: 'created_at',
    sort_order: 'desc',
    skip: 0,
    limit: 10,
  });

  // Debounce search to avoid refetching on every keystroke
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams(prev => ({ ...prev, search: searchTerm, skip: 0 }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Clear search on component unmount
  React.useEffect(() => {
    return () => {
      setSearchTerm('');
    };
  }, []);

  const { 
    todos, 
    totalTodos,
    analytics,
    isLoading, 
    isAnalyticsLoading,
    error, 
    createTodo, 
    updateTodo, 
    deleteTodo, 
    exportTodos,
    isCreating,
    isUpdating,
    isDeleting,
    isExporting
  } = useTodos(searchParams);

  const handleCreateTodo = (data: TodoCreate) => {
    createTodo(data);
    setShowForm(false);
    // Reset to first page and clear search/filters to show the new todo
    setSearchTerm('');
    setSearchParams(prev => ({ 
      ...prev, 
      search: '', 
      completed: 'all', 
      skip: 0 
    }));
  };

  const handleUpdateTodo = (id: number, data: TodoUpdate) => {
    updateTodo({ id, data });
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodo(id);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (value: 'all' | 'completed' | 'pending') => {
    setSearchParams(prev => ({ ...prev, completed: value, skip: 0 }));
  };

  const handleSortChange = (value: string) => {
    setSearchParams(prev => ({ ...prev, sort_by: value, skip: 0 }));
  };

  const handleSortOrderChange = (value: 'asc' | 'desc') => {
    setSearchParams(prev => ({ ...prev, sort_order: value, skip: 0 }));
  };

  const handleExport = (format: 'json' | 'csv') => {
    exportTodos({ format, params: searchParams });
  };

  const handlePageChange = (direction: 'prev' | 'next') => {
    const newSkip = direction === 'prev' 
      ? Math.max(0, (searchParams.skip || 0) - (searchParams.limit || 10))
      : (searchParams.skip || 0) + (searchParams.limit || 10);
    
    setSearchParams(prev => ({ ...prev, skip: newSkip }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p>Error loading todos: {error.message}</p>
      </div>
    );
  }

  const currentPage = Math.floor((searchParams.skip || 0) / (searchParams.limit || 10)) + 1;
  const totalPages = Math.ceil(totalTodos / (searchParams.limit || 10));
  const hasNextPage = (searchParams.skip || 0) + (searchParams.limit || 10) < totalTodos;
  const hasPrevPage = (searchParams.skip || 0) > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Todos</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Todo
        </button>
      </div>

      {/* Analytics Dashboard */}
      <Analytics 
        analytics={analytics}
        isLoading={isAnalyticsLoading}
      />

      {/* Search and Filter Bar */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        completedFilter={searchParams.completed || 'all'}
        onFilterChange={handleFilterChange}
        sortBy={searchParams.sort_by || 'created_at'}
        onSortChange={handleSortChange}
        sortOrder={searchParams.sort_order || 'desc'}
        onSortOrderChange={handleSortOrderChange}
        onExport={handleExport}
      />

      {/* Search Loading Indicator */}
      {searchTerm !== searchParams.search && (
        <div className="flex items-center justify-center py-2">
          <div className="flex items-center gap-2 text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">Searching...</span>
          </div>
        </div>
      )}

      {/* Add Todo Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <TodoForm 
            onSubmit={handleCreateTodo}
            onCancel={() => setShowForm(false)}
            isLoading={isCreating}
          />
        </div>
      )}

      {/* Todos List */}
      <div className="space-y-4">
        {todos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {searchParams.search || searchParams.completed !== 'all' 
                ? 'No todos match your search criteria.' 
                : 'No todos yet. Create your first todo to get started!'}
            </div>
          </div>
        ) : (
          todos.map((todo: Todo) => (
            <TodoItem 
              key={todo.id} 
              todo={todo}
              onUpdate={(data: TodoUpdate) => handleUpdateTodo(todo.id, data)}
              onDelete={() => handleDeleteTodo(todo.id)}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4">
          <div className="text-sm text-gray-600">
            Showing {((searchParams.skip || 0) + 1)} to {Math.min((searchParams.skip || 0) + (searchParams.limit || 10), totalTodos)} of {totalTodos} todos
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange('prev')}
              disabled={!hasPrevPage}
              className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange('next')}
              disabled={!hasNextPage}
              className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Export Loading */}
      {isExporting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Exporting todos...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodosPage; 