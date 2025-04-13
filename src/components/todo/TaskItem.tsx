import { Trash2, CheckCircle, Circle, AlertCircle, Flag, Calendar } from 'lucide-react';
import { TodoItem } from '../../types/todo';

interface TaskItemProps {
  item: TodoItem;
  onToggleCompletion: (item: TodoItem) => void;
  onDelete: (id: number) => void;
}

const TaskItem = ({ item, onToggleCompletion, onDelete }: TaskItemProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'URGENT':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return <Flag size={14} className="text-green-600" />;
      case 'MEDIUM':
        return <Flag size={14} className="text-blue-600" />;
      case 'HIGH':
        return <Flag size={14} className="text-orange-600" />;
      case 'URGENT':
        return <AlertCircle size={14} className="text-red-600" />;
      default:
        return <Flag size={14} className="text-gray-600" />;
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

  const isOverdue = (dateString: string | null) => {
    if (!dateString) return false;
    
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return dueDate < today && dueDate.getDate() !== today.getDate();
  };

  return (
    <li 
      className={`p-4 sm:p-5 transition-colors ${
        item.completed ? 'bg-gray-50' : ''
      } hover:bg-gray-50/50`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggleCompletion(item)}
          className="mt-0.5 flex-shrink-0 text-gray-400 hover:text-blue-600 transition-colors"
        >
          {item.completed ? (
            <CheckCircle size={20} className="text-blue-500" />
          ) : (
            <Circle size={20} />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className={`font-medium text-base ${
              item.completed ? 'line-through text-gray-500' : 'text-gray-800'
            }`}>
              {item.title}
            </h3>

            <button
              onClick={() => onDelete(item.id)}
              className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
              aria-label="Delete item"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {item.description && (
            <p className={`mt-1 text-sm ${
              item.completed ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {item.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className={`px-2 py-1 rounded border flex items-center gap-1 ${getPriorityColor(item.priority)}`}>
              {getPriorityIcon(item.priority)}
              {item.priority}
            </span>

            {item.dueDate && (
              <span className={`px-2 py-1 rounded flex items-center gap-1 ${
                isOverdue(item.dueDate) 
                  ? 'bg-red-50 text-red-600 border border-red-200' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}>
                <Calendar size={14} />
                {isOverdue(item.dueDate) ? 'Overdue: ' : 'Due: '}
                {formatDate(item.dueDate)}
              </span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default TaskItem;
