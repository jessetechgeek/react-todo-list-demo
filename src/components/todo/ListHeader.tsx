import { ArrowLeft, Edit, Save, X } from 'lucide-react';

interface ListHeaderProps {
  isEditingList: boolean;
  editedListData: {
    name: string;
    description: string;
  };
  setEditedListData: (data: any) => void;
  onSaveList: (e: React.FormEvent) => void;
  onCancelEdit: () => void;
  onStartEdit: () => void;
  listName: string;
  listDescription: string | null;
  onBack: () => void;
}

const ListHeader = ({
  isEditingList,
  editedListData,
  setEditedListData,
  onSaveList,
  onCancelEdit,
  onStartEdit,
  listName,
  listDescription,
  onBack
}: ListHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div className="flex items-center gap-3 mb-4 md:mb-0">
        <button
          onClick={onBack}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
          aria-label="Back to Home"
        >
          <ArrowLeft size={20} />
        </button>

        {isEditingList ? (
          <form onSubmit={onSaveList} className="flex-1 animate-scaleIn">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              value={editedListData.name}
              onChange={(e) => setEditedListData({...editedListData, name: e.target.value})}
              placeholder="List name"
              required
              autoFocus
            />
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              value={editedListData.description}
              onChange={(e) => setEditedListData({...editedListData, description: e.target.value})}
              placeholder="Description (optional)"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1.5"
              >
                <Save size={16} />
                Save
              </button>
              <button
                type="button"
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-1.5"
                onClick={onCancelEdit}
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="animate-fadeIn">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{listName}</h1>
            {listDescription && (
              <p className="text-gray-600 mt-1 text-sm sm:text-base">{listDescription}</p>
            )}
          </div>
        )}
      </div>

      {!isEditingList && (
        <button
          onClick={onStartEdit}
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition flex items-center gap-1.5 self-start md:self-center"
        >
          <Edit size={16} />
          Edit List
        </button>
      )}
    </div>
  );
};

export default ListHeader;
