import { useRef } from "react";
import { EditorContent, Editor } from "@tiptap/react";

interface NoteCardProps {
  editor: Editor | null;
  isEditing: boolean;
  selected: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  handlePaste: (e: React.ClipboardEvent) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function NoteCard({
  editor,
  isEditing,
  selected,
  setIsEditing,
  handlePaste,
  fileInputRef,
  handleFileChange,
}: NoteCardProps) {
  const contentAreaRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={contentAreaRef} className="relative" onPaste={handlePaste}>
      {/* TipTap Editor */}
      <EditorContent
        editor={editor}
        className={isEditing ? "cursor-text prose-sm" : "cursor-pointer"}
        onClick={(e) => {
          if (selected && !isEditing) {
            e.stopPropagation();
            setIsEditing(true);
          }
        }}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange || (() => {})}
      />
    </div>
  );
}
