import { ImageIcon } from "lucide-react";
import { memo } from "react";

interface ImageCardProps {
  content: string;
  details: string[];
  id: string;
  onUpdate?: (
    id: string,
    updates: Partial<{
      content: string;
      details: string[];
      type: string;
      html?: string;
      width?: number;
      height?: number;
    }>
  ) => void;
  handlePaste: (e: React.ClipboardEvent) => void;
  handleImageUpload: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

function ImageCard({
  content,
  details,
  handlePaste,
  handleImageUpload,
  handleFileChange,
  fileInputRef,
}: ImageCardProps) {
  return (
    <div className="bg-white h-40 flex flex-col items-center justify-center">
      {details[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={details[0]}
          alt={content}
          className="h-full w-full object-contain"
        />
      ) : (
        <div
          className="flex flex-col items-center w-full h-full"
          onPaste={handlePaste}
        >
          <div
            className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={handleImageUpload}
          >
            <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-xs text-gray-500">
              Click to upload or paste an image
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}

export default memo(ImageCard);
