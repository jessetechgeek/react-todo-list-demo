interface ProgressBarProps {
  completedItems: number;
  totalItems: number;
}

const ProgressBar = ({ completedItems, totalItems }: ProgressBarProps) => {
  const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-medium text-gray-700 mb-3 text-sm">Progress</h3>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-gray-600">Completed</span>
        <span className="font-medium">{completedItems} of {totalItems}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {totalItems > 0 && (
        <div className="text-xs text-gray-500 text-center">
          {percentage}% complete
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
