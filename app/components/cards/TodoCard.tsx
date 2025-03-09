import { memo } from "react";
import { CheckIcon, PlusIcon, XIcon } from "lucide-react";

interface TodoCardProps {
  editableDetails: string[];
  newItem: string;
  setNewItem: React.Dispatch<React.SetStateAction<string>>;
  handleDetailUpdate: (index: number, value: string) => void;
  handleRemoveDetail: (index: number) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

function TodoCard({
  editableDetails,
  newItem,
  setNewItem,
  handleDetailUpdate,
  handleRemoveDetail,
  handleKeyDown,
}: TodoCardProps) {
  return (
    <div className="space-y-2">
      {editableDetails.map((detail, index) => (
        <div key={index} className="flex items-center group">
          <button
            className="w-4 h-4 rounded-sm border border-gray-300 flex items-center justify-center mr-2 flex-shrink-0"
            onClick={() => handleRemoveDetail(index)}
          >
            <CheckIcon className="h-2 w-2 text-gray-500" />
          </button>
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              handleDetailUpdate(index, e.currentTarget.textContent || "")
            }
            className="flex-1 text-xs text-gray-600 focus:outline-none"
          >
            {detail}
          </div>
          <button
            className="ml-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleRemoveDetail(index)}
          >
            <XIcon className="h-3 w-3" />
          </button>
        </div>
      ))}
      <div className="flex items-center mt-2">
        <button className="w-4 h-4 rounded-sm border border-gray-300 flex items-center justify-center mr-2 flex-shrink-0">
          <PlusIcon className="h-2 w-2 text-gray-500" />
        </button>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add new item..."
          className="flex-1 text-xs text-gray-600 bg-transparent focus:outline-none"
        />
      </div>
    </div>
  );
}

export default memo(TodoCard);
