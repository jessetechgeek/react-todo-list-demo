import { Filter, Flag, SortDesc, AlertCircle, Search, X, Check } from 'lucide-react';

interface TaskFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: 'all' | 'active' | 'completed';
  setFilterStatus: (status: 'all' | 'active' | 'completed') => void;
  filterPriority: string | null;
  setFilterPriority: (priority: string | null) => void;
  sortBy: 'dueDate' | 'priority' | 'createdAt';
  sortDirection: 'asc' | 'desc';
  toggleSort: (sortKey: 'dueDate' | 'priority' | 'createdAt') => void;
}

const TaskFilters = ({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  sortBy,
  sortDirection,
  toggleSort
}: TaskFiltersProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-5">
      {/* Search input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">
          <Search size={16} />
        </span>
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>
      
      {/* Status filter */}
      <div>
        <h3 className="font-medium text-gray-700 flex items-center gap-2 mb-2 text-sm">
          <Filter size={14} />
          Filter by Status
        </h3>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setFilterStatus('all')}
            className={`flex items-center justify-between px-3 py-2 rounded-md text-left text-sm ${filterStatus === 'all' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
          >
            <span>All tasks</span>
            {filterStatus === 'all' && <Check size={14} />}
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`flex items-center justify-between px-3 py-2 rounded-md text-left text-sm ${filterStatus === 'active' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
          >
            <span>Active</span>
            {filterStatus === 'active' && <Check size={14} />}
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`flex items-center justify-between px-3 py-2 rounded-md text-left text-sm ${filterStatus === 'completed' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
          >
            <span>Completed</span>
            {filterStatus === 'completed' && <Check size={14} />}
          </button>
        </div>
      </div>

      {/* Priority filter */}
      <div>
        <h3 className="font-medium text-gray-700 flex items-center gap-2 mb-2 text-sm">
          <Flag size={14} />
          Filter by Priority
        </h3>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setFilterPriority(null)}
            className={`flex items-center justify-between px-3 py-2 rounded-md text-left text-sm ${filterPriority === null ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
          >
            <span>All priorities</span>
            {filterPriority === null && <Check size={14} />}
          </button>
          <button
            onClick={() => setFilterPriority('URGENT')}
            className={`flex items-center justify-between px-3 py-2 rounded-md text-left text-sm ${filterPriority === 'URGENT' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50'}`}
          >
            <div className="flex items-center gap-1.5">
              <AlertCircle size={14} className="text-red-500" />
              <span>Urgent</span>
            </div>
            {filterPriority === 'URGENT' && <Check size={14} />}
          </button>
          <button
            onClick={() => setFilterPriority('HIGH')}
            className={`flex items-center justify-between px-3 py-2 rounded-md text-left text-sm ${filterPriority === 'HIGH' ? 'bg-orange-50 text-orange-600' : 'hover:bg-gray-50'}`}
          >
            <div className="flex items-center gap-1.5">
              <Flag size={14} className="text-orange-500" />
              <span>High</span>
            </div>
            {filterPriority === 'HIGH' && <Check size={14} />}
          </button>
          <button
            onClick={() => setFilterPriority('MEDIUM')}
            className={`flex items-center justify-between px-3 py-2 rounded-md text-left text-sm ${filterPriority === 'MEDIUM' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
          >
            <div className="flex items-center gap-1.5">
              <Flag size={14} className="text-blue-500" />
              <span>Medium</span>
            </div>
            {filterPriority === 'MEDIUM' && <Check size={14} />}
          </button>
          <button
            onClick={() => setFilterPriority('LOW')}
            className={`flex items-center justify-between px-3 py-2 rounded-md text-left text-sm ${filterPriority === 'LOW' ? 'bg-green-50 text-green-600' : 'hover:bg-gray-50'}`}
          >
            <div className="flex items-center gap-1.5">
              <Flag size={14} className="text-green-500" />
              <span>Low</span>
            </div>
            {filterPriority === 'LOW' && <Check size={14} />}
          </button>
        </div>
      </div>

      {/* Sort options */}
      <div>
        <h3 className="font-medium text-gray-700 flex items-center gap-2 mb-2 text-sm">
          <SortDesc size={14} />
          Sort by
        </h3>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => toggleSort('createdAt')}
            className={`flex items-center justify-between px-3 py-2 rounded-md text-left text-sm ${sortBy === 'createdAt' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
          >
            <span>Date created</span>
            {sortBy === 'createdAt' && (
              <span className="text-xs bg-blue-100 px-1.5 py-0.5 rounded">
                {sortDirection === 'asc' ? 'Oldest' : 'Newest'}
              </span>
            )}
          </button>
          <button
            onClick={() => toggleSort('dueDate')}
            className={`flex items-center justify-between px-3 py-2 rounded-md text-left text-sm ${sortBy === 'dueDate' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
          >
            <span>Due date</span>
            {sortBy === 'dueDate' && (
              <span className="text-xs bg-blue-100 px-1.5 py-0.5 rounded">
                {sortDirection === 'asc' ? 'Earliest' : 'Latest'}
              </span>
            )}
          </button>
          <button
            onClick={() => toggleSort('priority')}
            className={`flex items-center justify-between px-3 py-2 rounded-md text-left text-sm ${sortBy === 'priority' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
          >
            <span>Priority</span>
            {sortBy === 'priority' && (
              <span className="text-xs bg-blue-100 px-1.5 py-0.5 rounded">
                {sortDirection === 'asc' ? 'Lowest' : 'Highest'}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
