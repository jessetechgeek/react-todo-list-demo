import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { todoApi } from '../lib/api-client';
import { Plus, AlertCircle, X, ArrowLeft } from 'lucide-react';
import { TodoItem, TodoList } from '../types/todo';

// Import our components
import ListHeader from '../components/todo/ListHeader';
import TaskFilters from '../components/todo/TaskFilters';
import TaskList from '../components/todo/TaskList';
import AddTaskModal from '../components/todo/AddTaskModal';
import ProgressBar from '../components/todo/ProgressBar';

const TodoListPage = () => {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();

  const [list, setList] = useState<TodoList | null>(null);
  const [items, setItems] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state for adding a new item
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as const,
    dueDate: ''
  });
  
  // UI states
  const [isCreatingItem, setIsCreatingItem] = useState(false);
  const [isEditingList, setIsEditingList] = useState(false);
  const [editedListData, setEditedListData] = useState({
    name: '',
    description: ''
  });
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  // Load data on component mount
  useEffect(() => {
    if (!listId) return;

    const fetchListData = async () => {
      try {
        setLoading(true);
        const [listData, itemsData] = await Promise.all([
          todoApi.getList(parseInt(listId)),
          todoApi.getItems(parseInt(listId))
        ]);

        setList(listData);
        setItems(itemsData);
        setEditedListData({
          name: listData.name,
          description: listData.description || ''
        });
        setError(null);
      } catch (err) {
        setError('Failed to load the todo list');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListData();
  }, [listId]);

  // Create a new task
  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!listId || !newItem.title.trim()) return;

    try {
      setIsCreatingItem(true);
      const itemData = {
        ...newItem,
        dueDate: newItem.dueDate ? new Date(newItem.dueDate).toISOString() : undefined
      };

      const createdItem = await todoApi.createItem(parseInt(listId), itemData);
      setItems([...items, createdItem]);

      // Reset form
      setNewItem({
        title: '',
        description: '',
        priority: 'MEDIUM',
        dueDate: ''
      });

      // Update list item count
      if (list) {
        setList({
          ...list,
          itemCount: list.itemCount + 1
        });
      }
      
      // Close form after successful submission
      setShowAddItemForm(false);
    } catch (err) {
      setError('Failed to create a new item');
      console.error(err);
    } finally {
      setIsCreatingItem(false);
    }
  };

  // Toggle item completion status
  const toggleItemCompletion = async (item: TodoItem) => {
    if (!listId) return;

    try {
      const updatedItem = await todoApi.updateItem(
        parseInt(listId),
        item.id,
        {
          completed: !item.completed,
          title: item.title,
          description: item.description,
          priority: item.priority,
        }
      );

      setItems(items.map(i => i.id === item.id ? updatedItem : i));
    } catch (err) {
      setError('Failed to update the item');
      console.error("Error updating item:", err);
    }
  };

  // Delete an item
  const handleDeleteItem = async (itemId: number) => {
    if (!listId || !confirm('Are you sure you want to delete this item?')) return;

    try {
      await todoApi.deleteItem(parseInt(listId), itemId);
      setItems(items.filter(item => item.id !== itemId));

      // Update list item count
      if (list) {
        setList({
          ...list,
          itemCount: list.itemCount - 1
        });
      }
    } catch (err) {
      setError('Failed to delete the item');
      console.error(err);
    }
  };

  // Update list name and description
  const handleUpdateList = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!listId || !editedListData.name.trim()) return;

    try {
      const updatedList = await todoApi.updateList(parseInt(listId), editedListData);
      setList(updatedList);
      setIsEditingList(false);
    } catch (err) {
      setError('Failed to update the list');
      console.error(err);
    }
  };

  // Toggle sort direction and field
  const toggleSort = (sortKey: 'dueDate' | 'priority' | 'createdAt') => {
    if (sortBy === sortKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(sortKey);
      setSortDirection('desc');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterStatus('all');
    setFilterPriority(null);
    setSearchQuery('');
  };

  // Apply filters and sort
  const filteredAndSortedItems = items
    .filter(item => {
      // Filter by status
      if (filterStatus === 'active' && item.completed) return false;
      if (filterStatus === 'completed' && !item.completed) return false;

      // Filter by priority
      if (filterPriority && item.priority !== filterPriority) return false;

      // Filter by search query
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !item.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortBy === 'dueDate') {
        // Handle null due dates
        if (!a.dueDate) return sortDirection === 'asc' ? 1 : -1;
        if (!b.dueDate) return sortDirection === 'asc' ? -1 : 1;
        
        return sortDirection === 'asc' 
          ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime() 
          : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      } 
      
      if (sortBy === 'priority') {
        const priorityValues = { 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3, 'URGENT': 4 };
        const aPriority = priorityValues[a.priority] || 0;
        const bPriority = priorityValues[b.priority] || 0;
        
        return sortDirection === 'asc' ? aPriority - bPriority : bPriority - aPriority;
      }
      
      // Default sort by createdAt
      return sortDirection === 'asc' 
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() 
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 font-medium">Loading todo list...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 shadow-sm animate-fadeIn flex justify-between items-center">
          <div className="flex items-center">
            <AlertCircle size={20} className="mr-2" />
            {error}
          </div>
          <button 
            onClick={() => setError(null)} 
            className="text-red-500 hover:text-red-700"
          >
            <X size={18} />
          </button>
        </div>
        <button
          onClick={handleBackToHome}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 transition flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>
      </div>
    );
  }

  // List not found state
  if (!list) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 rounded-md mb-6 shadow-sm">
          <div className="flex items-center">
            <AlertCircle size={20} className="mr-2" />
            Todo list not found
          </div>
        </div>
        <button
          onClick={handleBackToHome}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 transition flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
      {/* List header section */}
      <ListHeader 
        isEditingList={isEditingList}
        editedListData={editedListData}
        setEditedListData={setEditedListData}
        onSaveList={handleUpdateList}
        onCancelEdit={() => {
          setIsEditingList(false);
          setEditedListData({
            name: list.name,
            description: list.description || ''
          });
        }}
        onStartEdit={() => setIsEditingList(true)}
        listName={list.name}
        listDescription={list.description}
        onBack={handleBackToHome}
      />

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar controls */}
        <div className="w-full lg:w-64 space-y-4">
          {/* Add item button */}
          <button
            onClick={() => setShowAddItemForm(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-sm transition duration-200 ease-in-out flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Add New Task
          </button>

          {/* Filters */}
          <TaskFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            sortBy={sortBy}
            sortDirection={sortDirection}
            toggleSort={toggleSort}
          />
          
          {/* Progress overview */}
          <ProgressBar 
            completedItems={items.filter(i => i.completed).length}
            totalItems={items.length}
          />
        </div>

        {/* Task list */}
        <div className="flex-1">
          <TaskList 
            items={filteredAndSortedItems}
            onToggleCompletion={toggleItemCompletion}
            onDelete={handleDeleteItem}
            onAddTask={() => setShowAddItemForm(true)}
            totalItems={items.length}
            completedItems={items.filter(item => item.completed).length}
            onClearFilters={clearFilters}
          />
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal 
        isOpen={showAddItemForm}
        onClose={() => setShowAddItemForm(false)}
        newItem={newItem}
        setNewItem={setNewItem}
        onSubmit={handleCreateItem}
        isCreating={isCreatingItem}
      />
    </div>
  );
};

export default TodoListPage;