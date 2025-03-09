import { memo } from "react";
import { LinkIcon } from "lucide-react";

interface LinkCardProps {
  content: string;
  details: string[];
  id: string;
  editableDetails: string[];
  setEditableDetails: React.Dispatch<React.SetStateAction<string[]>>;
  onUpdate?: (
    id: string,
    updates: Partial<{
      content: string;
      details: string[];
      type: string;
      html?: string;
    }>
  ) => void;
}

function LinkCard({
  content,
  details,
  id,
  editableDetails,
  setEditableDetails,
  onUpdate,
}: LinkCardProps) {
  return (
    <div className="bg-blue-50/50 p-3 flex flex-col">
      {details[0] ? (
        <a
          href={details[0]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline flex items-center text-xs"
          onClick={(e) => e.stopPropagation()}
        >
          <LinkIcon className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
          <span>{content}</span>
        </a>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center">
            <LinkIcon className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={content}
              onChange={(e) => {
                if (onUpdate) {
                  onUpdate(id, { content: e.target.value });
                }
              }}
              className="flex-1 text-xs text-gray-600 bg-transparent focus:outline-none"
            />
          </div>
          <input
            type="url"
            value={editableDetails[0] || ""}
            onChange={(e) => {
              const newDetails = [e.target.value];
              setEditableDetails(newDetails);
              if (onUpdate) {
                onUpdate(id, { details: newDetails });
              }
            }}
            placeholder="https://example.com"
            className="w-full text-xs text-blue-600 bg-transparent focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}

export default memo(LinkCard);
