import { Plus, X } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  newItem: {
    title: string;
    description: string;
    priority: string;
    dueDate: string;
  };
  setNewItem: (item: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isCreating: boolean;
}

const AddTaskModal = ({
  isOpen,
  onClose,
  newItem,
  setNewItem,
  onSubmit,
  isCreating
}: AddTaskModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative animate-scaleIn">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Task</h2>
          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <label htmlFor="itemTitle" className="block text-gray-700 mb-2 text-sm font-medium">Title</label>
              <input
                id="itemTitle"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newItem.title}
                onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                placeholder="What needs to be done?"
                required
                autoFocus
              />
            </div>

            <div className="mb-4">
              <label htmlFor="itemDescription" className="block text-gray-700 mb-2 text-sm font-medium">
                Description (optional)
              </label>
              <textarea
                id="itemDescription"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                placeholder="Any details about this task?"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="itemPriority" className="block text-gray-700 mb-2 text-sm font-medium">Priority</label>
                <select
                  id="itemPriority"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newItem.priority}
                  onChange={(e) => setNewItem({
                    ...newItem,
                    priority: e.target.value
                  })}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div>
                <label htmlFor="itemDueDate" className="block text-gray-700 mb-2 text-sm font-medium">
                  Due Date (optional)
                </label>
                <input
                  id="itemDueDate"
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newItem.dueDate}
                  onChange={(e) => setNewItem({...newItem, dueDate: e.target.value})}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isCreating || !newItem.title.trim()}
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    <span>Add Task</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
