import {
  FileTextIcon,
  ImageIcon,
  LinkIcon,
  ListIcon,
  Trash2Icon,
} from "lucide-react";

interface BoardSidebarProps {
  onAddItem: (type: string) => void;
  onDeleteAll: () => void;
}

export default function BoardSidebar({
  onAddItem,
  onDeleteAll,
}: BoardSidebarProps) {
  const sidebarItems = [
    { icon: <FileTextIcon size={16} />, label: "Note", type: "note" },
    { icon: <LinkIcon size={16} />, label: "Link", type: "link" },
    { icon: <ListIcon size={16} />, label: "To-do", type: "todo" },
    { icon: <ImageIcon size={16} />, label: "Image", type: "image" },
    ,
  ];

  return (
    <div className="fixed left-0 top-0 bottom-0 w-14 bg-white border-r border-gray-200 flex flex-col items-center py-4 shadow-sm z-10">
      <div className="flex-1 flex flex-col items-center w-full space-y-3 mt-2">
        {sidebarItems.map(
          (item, index) =>
            item && (
              <button
                key={index}
                className="w-full px-2 py-1.5 flex flex-col items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-xs"
                onClick={() => onAddItem(item.type)}
                title={item.label}
              >
                <div className="mb-1">{item.icon}</div>
                <span className="text-[9px] font-medium text-gray-500">
                  {item.label}
                </span>
              </button>
            )
        )}
      </div>

      <div className="mt-auto mb-4">
        <button
          onClick={onDeleteAll}
          className="w-full px-2 py-1.5 flex flex-col items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-xs"
        >
          <div className="mb-1">
            <Trash2Icon size={16} />
          </div>
          <span className="text-[9px] font-medium text-gray-500">Trash</span>
        </button>
      </div>
    </div>
  );
}
