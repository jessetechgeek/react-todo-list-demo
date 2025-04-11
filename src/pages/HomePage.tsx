import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { todoApi } from '../lib/api-client';

type TodoList = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  itemCount: number;
};

const HomePage = () => {
  const [lists, setLists] = useState<TodoList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      setLoading(true);
      const data = await todoApi.getLists();
      setLists(data);
      setError(null);
    } catch (err) {
      setError('Failed to load your todo lists');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newListName.trim()) return;
    
    try {
      setIsCreating(true);
      const newList = await todoApi.createList({
        name: newListName,
        description: newListDescription
      });
      
      setLists([...lists, newList]);
      setNewListName('');
      setNewListDescription('');
      setIsCreating(false);
    } catch (err) {
      setError('Failed to create a new list');
      console.error(err);
      setIsCreating(false);
    }
  };

  const handleDeleteList = async (listId: number) => {
    if (!confirm('Are you sure you want to delete this list?')) return;
    
    try {
      await todoApi.deleteList(listId);
      setLists(lists.filter(list => list.id !== listId));
    } catch (err) {
      setError('Failed to delete the list');
      console.error(err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Todo Lists</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New List</h2>
        <form onSubmit={handleCreateList}>
          <div className="mb-4">
            <label htmlFor="listName" className="block text-gray-700 mb-2">List Name</label>
            <input
              id="listName"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="My new todo list"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="listDescription" className="block text-gray-700 mb-2">Description (optional)</label>
            <textarea
              id="listDescription"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newListDescription}
              onChange={(e) => setNewListDescription(e.target.value)}
              placeholder="What is this list for?"
              rows={2}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isCreating || !newListName.trim()}
          >
            {isCreating ? 'Creating...' : 'Create List'}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading your lists...</p>
        </div>
      ) : (
        <>
          {lists.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h2 className="text-xl text-gray-700 mb-2">You don't have any todo lists yet</h2>
              <p className="text-gray-500 mb-4">Create your first list to get started!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lists.map((list) => (
                <div key={list.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 truncate">{list.name}</h3>
                    {list.description && (
                      <p className="text-gray-600 mb-4 line-clamp-2">{list.description}</p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{list.itemCount} items</span>
                      <span>Created {formatDate(list.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <Link 
                        to={`/lists/${list.id}`} 
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      >
                        View List
                      </Link>
                      <button
                        onClick={() => handleDeleteList(list.id)}
                        className="px-4 py-2 text-red-600 hover:text-red-800 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
