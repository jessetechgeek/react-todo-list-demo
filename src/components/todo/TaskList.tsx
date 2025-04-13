import { Filter, Plus } from 'lucide-react';
import TaskItem from './TaskItem';
import { TodoItem } from '../../types/todo';

interface TaskListProps {
  items: TodoItem[];
  onToggleCompletion: (item: TodoItem) => void;
  onDelete: (id: number) => void;
  onAddTask: () => void;
  totalItems: number;
  completedItems: number;
  onClearFilters: () => void;
}

const TaskList = ({ 
  items, 
  onToggleCompletion, 
  onDelete, 
  onAddTask,
  totalItems,
  completedItems,
  onClearFilters
}: TaskListProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
      <div className="p-4 sm:p-5 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Tasks ({items.length})
        </h2>
        <div className="text-sm text-gray-500">
          {completedItems} of {totalItems} completed
        </div>
      </div>

      {totalItems === 0 ? (
        <div className="p-10 text-center">
          <div className="inline-block p-3 bg-gray-100 rounded-full mb-3">
            <Plus size={24} className="text-gray-400" />
          </div>
          <h3 className="text-gray-700 font-medium mb-1">No tasks yet</h3>
          <p className="text-gray-500 text-sm mb-4">This list is empty. Add your first task to get started!</p>
          <button
            onClick={onAddTask}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add First Task
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="p-10 text-center">
          <div className="inline-block p-3 bg-gray-100 rounded-full mb-3">
            <Filter size={24} className="text-gray-400" />
          </div>
          <h3 className="text-gray-700 font-medium mb-1">No matching tasks</h3>
          <p className="text-gray-500 text-sm mb-4">Try changing your filters or search query</p>
          <button
            onClick={onClearFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {items.map((item) => (
            <TaskItem 
              key={item.id}
              item={item}
              onToggleCompletion={onToggleCompletion}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
