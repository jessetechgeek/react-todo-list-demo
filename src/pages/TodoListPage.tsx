import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { todoApi } from '../lib/api-client';

type TodoItem = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  dueDate: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  todoListId: number;
};

type TodoList = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  itemCount: number;
};

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
  const [isCreatingItem, setIsCreatingItem] = useState(false);
  const [isEditingList, setIsEditingList] = useState(false);
  const [editedListData, setEditedListData] = useState({
    name: '',
    description: ''
  });

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
    } catch (err) {
      setError('Failed to create a new item');
      console.error(err);
    } finally {
      setIsCreatingItem(false);
    }
  };
  
  const toggleItemCompletion = async (item: TodoItem) => {
    if (!listId) return;
    
    try {
      const updatedItem = await todoApi.updateItem(
        parseInt(listId),
        item.id,
        { completed: !item.completed }
      );
      
      setItems(items.map(i => i.id === item.id ? updatedItem : i));
    } catch (err) {
      setError('Failed to update the item');
      console.error(err);
    }
  };
  
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
  
  const handleBackToHome = () => {
    navigate('/');
  };
  
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-blue-100 text-blue-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'URGENT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No due date';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-600">Loading todo list...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={handleBackToHome}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 transition"
        >
          Back to Home
        </button>
      </div>
    );
  }
  
  if (!list) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded mb-4">
          Todo list not found
        </div>
        <button
          onClick={handleBackToHome}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 transition"
        >
          Back to Home
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <button
            onClick={handleBackToHome}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 transition"
          >
            ← Back
          </button>
          
          {isEditingList ? (
            <form onSubmit={handleUpdateList} className="flex-1">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                value={editedListData.name}
                onChange={(e) => setEditedListData({...editedListData, name: e.target.value})}
                placeholder="List name"
                required
              />
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                value={editedListData.description}
                onChange={(e) => setEditedListData({...editedListData, description: e.target.value})}
                placeholder="Description (optional)"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                  onClick={() => {
                    setIsEditingList(false);
                    setEditedListData({
                      name: list.name,
                      description: list.description || ''
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{list.name}</h1>
              {list.description && <p className="text-gray-600 mt-1">{list.description}</p>}
            </div>
          )}
        </div>
        
        {!isEditingList && (
          <button 
            onClick={() => setIsEditingList(true)}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 transition"
          >
            Edit List
          </button>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
        <form onSubmit={handleCreateItem}>
          <div className="mb-4">
            <label htmlFor="itemTitle" className="block text-gray-700 mb-2">Title</label>
            <input
              id="itemTitle"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newItem.title}
              onChange={(e) => setNewItem({...newItem, title: e.target.value})}
              placeholder="What needs to be done?"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="itemDescription" className="block text-gray-700 mb-2">Description (optional)</label>
            <textarea
              id="itemDescription"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newItem.description}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              placeholder="Any details about this task?"
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="itemPriority" className="block text-gray-700 mb-2">Priority</label>
              <select
                id="itemPriority"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newItem.priority}
                onChange={(e) => setNewItem({
                  ...newItem, 
                  priority: e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
                })}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="itemDueDate" className="block text-gray-700 mb-2">Due Date (optional)</label>
              <input
                id="itemDueDate"
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newItem.dueDate}
                onChange={(e) => setNewItem({...newItem, dueDate: e.target.value})}
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isCreatingItem || !newItem.title.trim()}
          >
            {isCreatingItem ? 'Adding...' : 'Add Item'}
          </button>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">
            Todo Items ({items.length})
          </h2>
        </div>
        
        {items.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No items in this list yet. Add your first task above!
          </div>
        ) : (
          <ul className="divide-y">
            {items.map((item) => (
              <li key={item.id} className={`p-4 ${item.completed ? 'bg-gray-50' : ''}`}>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleItemCompletion(item)}
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {item.title}
                      </h3>
                      
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        Delete
                      </button>
                    </div>
                    
                    {item.description && (
                      <p className={`mt-1 text-sm ${item.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.description}
                      </p>
                    )}
                    
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className={`px-2 py-1 rounded ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                      
                      {item.dueDate && (
                        <span className="px-2 py-1 rounded bg-gray-100 text-gray-800">
                          Due: {formatDate(item.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TodoListPage;
