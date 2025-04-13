import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { todoApi } from '../lib/api-client';
import { Plus, Search, X, List, Calendar, Trash2, PlusCircle, Check } from 'lucide-react';

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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'items'>('date');

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
      setShowCreateForm(false);
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

  const filteredLists = lists
    .filter(list => 
      list.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      list.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'items') return b.itemCount - a.itemCount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
      {/* Hero section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">My Todo Lists</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Organize your tasks efficiently and never miss deadlines again.
        </p>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 shadow-sm animate-fadeIn flex justify-between items-center">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
            </svg>
            {error}
          </div>
          <button 
            onClick={() => setError(null)} 
            className="text-red-500 hover:text-red-700"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-64 space-y-4">
          {/* Create list button */}
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-sm transition-all duration-200 ease-in-out transform hover:scale-102 flex items-center justify-center gap-2"
          >
            <PlusCircle size={20} />
            Create New List
          </button>

          {/* Search and filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search lists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Sort by</p>
              <div className="space-y-1">
                <button 
                  onClick={() => setSortBy('date')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md ${sortBy === 'date' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Date created</span>
                  </div>
                  {sortBy === 'date' && <Check size={16} />}
                </button>
                <button 
                  onClick={() => setSortBy('name')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md ${sortBy === 'name' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  <div className="flex items-center gap-2">
                    <List size={16} />
                    <span>Alphabetical</span>
                  </div>
                  {sortBy === 'name' && <Check size={16} />}
                </button>
                <button 
                  onClick={() => setSortBy('items')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md ${sortBy === 'items' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  <div className="flex items-center gap-2">
                    <List size={16} />
                    <span>Most items</span>
                  </div>
                  {sortBy === 'items' && <Check size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1">
          {/* Loading state */}
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Loading your lists...</p>
            </div>
          ) : (
            <>
              {/* Empty state */}
              {filteredLists.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm p-10 text-center">
                  {searchQuery ? (
                    <>
                      <div className="inline-block p-3 bg-gray-100 rounded-full mb-4">
                        <Search className="text-gray-500" size={24} />
                      </div>
                      <h2 className="text-xl text-gray-700 mb-2">No matching lists found</h2>
                      <p className="text-gray-500 mb-4">Try a different search term or clear the filter</p>
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Clear search
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
                        <PlusCircle className="text-blue-500" size={24} />
                      </div>
                      <h2 className="text-xl text-gray-700 mb-2">You don't have any todo lists yet</h2>
                      <p className="text-gray-500 mb-4">Create your first list to get started!</p>
                      <button 
                        onClick={() => setShowCreateForm(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Create your first list
                      </button>
                    </>
                  )}
                </div>
              )}
              
              {/* Lists grid */}
              {filteredLists.length > 0 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredLists.map((list) => (
                    <div 
                      key={list.id} 
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-100 group"
                    >
                      <div className="p-5">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                          {list.name}
                        </h3>
                        {list.description && (
                          <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{list.description}</p>
                        )}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span className="bg-gray-100 px-2 py-1 rounded-full">{list.itemCount} items</span>
                          <span className="text-xs">{formatDate(list.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <Link 
                            to={`/lists/${list.id}`} 
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex-grow text-center"
                          >
                            View List
                          </Link>
                          <button
                            onClick={() => handleDeleteList(list.id)}
                            className="ml-2 p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                            title="Delete list"
                          >
                            <Trash2 size={18} />
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
      </div>

      {/* Create List Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative animate-scaleIn">
            <button 
              onClick={() => setShowCreateForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Create New List</h2>
              <form onSubmit={handleCreateList}>
                <div className="mb-4">
                  <label htmlFor="listName" className="block text-gray-700 text-sm font-medium mb-2">List Name</label>
                  <input
                    id="listName"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="My new todo list"
                    required
                    autoFocus
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="listDescription" className="block text-gray-700 text-sm font-medium mb-2">Description (optional)</label>
                  <textarea
                    id="listDescription"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={newListDescription}
                    onChange={(e) => setNewListDescription(e.target.value)}
                    placeholder="What is this list for?"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isCreating || !newListName.trim()}
                  >
                    {isCreating ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Plus size={18} />
                        <span>Create List</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;