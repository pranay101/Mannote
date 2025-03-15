import { memo, useEffect, useState, useCallback, useRef } from "react";
import {
  LinkIcon,
  AlertCircleIcon,
  ExternalLinkIcon,
  ClipboardIcon,
} from "lucide-react";
import Image from "next/image";
import { isValidURL } from "@/utils";

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
      width?: number;
      height?: number;
    }>
  ) => void;
}

interface LinkMetadata {
  title: string;
  description: string;
  image: string;
  favicon: string;
  url: string;
}

function LinkCard({
  content,
  details,
  id,
  editableDetails,
  setEditableDetails,
  onUpdate,
}: LinkCardProps) {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [faviconError, setFaviconError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(!details[0]);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState<number | null>(null);

  // Preserve the card dimensions when loading metadata
  useEffect(() => {
    if (cardRef.current && !isEditing && !loading && !cardHeight) {
      setCardHeight(cardRef.current.offsetHeight);
    }
  }, [isEditing, loading, cardHeight]);

  const fetchLinkMetadata = useCallback(
    async (url: string) => {
      if (!url) return;

      if (!isValidURL(url)) {
        setError("Invalid URL");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setFaviconError(false);

        // Store current dimensions before loading
        if (cardRef.current && !cardHeight) {
          setCardHeight(cardRef.current.offsetHeight);
        }

        const response = await fetch(
          `/api/link-metadata?url=${encodeURIComponent(url)}`,
          {
            signal: AbortSignal.timeout(10000), // 10 second timeout
          }
        );

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Failed to fetch link metadata" }));
          throw new Error(errorData.error || "Failed to fetch link metadata");
        }

        const data = await response.json();
        setMetadata(data);

        // If we have a title but no content, update the content with the title
        if (data.title && !content && onUpdate) {
          onUpdate(id, { content: data.title });
        }

        // Update the node dimensions to maintain consistency
        if (onUpdate && cardHeight) {
          // Set a minimum height based on the content
          const minHeight = data.image ? 250 : 150;
          onUpdate(id, {
            height: Math.max(cardHeight, minHeight),
            // Ensure width is consistent
            width: 288,
          });
        }
      } catch (err) {
        console.error("Error fetching link metadata:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load link preview"
        );
      } finally {
        setLoading(false);
      }
    },
    [content, id, onUpdate, cardHeight]
  );

  useEffect(() => {
    const controller = new AbortController();

    if (details[0] && !isEditing) {
      fetchLinkMetadata(details[0]);
    } else {
      setMetadata(null);
      setError(null);
      setLoading(false);
    }

    return () => {
      controller.abort();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [details, fetchLinkMetadata, isEditing]);

  const handleFaviconError = () => {
    setFaviconError(true);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    const newDetails = [newUrl];
    setEditableDetails(newDetails);
    if (onUpdate) {
      onUpdate(id, { details: newDetails });
    }
  };

  const handleUrlSubmit = () => {
    if (editableDetails[0]) {
      setIsEditing(false);
      // Reset card height when submitting a new URL
      setCardHeight(null);
      fetchLinkMetadata(editableDetails[0]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleUrlSubmit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  const handleCopyLink = () => {
    if (metadata?.url) {
      navigator.clipboard.writeText(metadata.url);
      setCopied(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    // Reset card height when editing
    setCardHeight(null);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const handleRetry = () => {
    if (details[0]) {
      // Reset card height when retrying
      setCardHeight(null);
      fetchLinkMetadata(details[0]);
    }
  };

  return (
    <div
      ref={cardRef}
      className="bg-white flex flex-col rounded border border-gray-200 overflow-hidden transition-shadow duration-200 hover:shadow-sm group"
      style={{
        minHeight: cardHeight ? `${cardHeight}px` : undefined,
        height: "100%",
      }}
    >
      {isEditing ? (
        <div className="p-3 space-y-3">
          <div className="flex items-center">
            <LinkIcon className="h-4 w-4 text-indigo-500 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={content}
              onChange={(e) => {
                if (onUpdate) {
                  onUpdate(id, { content: e.target.value });
                }
              }}
              placeholder="Link title (optional)"
              className="flex-1 text-xs text-gray-700 bg-transparent focus:outline-none"
            />
          </div>
          <div className="flex items-center">
            <input
              ref={inputRef}
              type="url"
              value={editableDetails[0] || ""}
              onChange={handleUrlChange}
              onKeyDown={handleKeyDown}
              placeholder="https://example.com"
              className="w-full text-xs text-indigo-600 bg-transparent focus:outline-none"
              autoFocus
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleUrlSubmit}
              className="text-xs bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded transition-colors duration-200"
              disabled={!editableDetails[0] || !isValidURL(editableDetails[0])}
            >
              Add Link
            </button>
          </div>
        </div>
      ) : (
        <>
          {loading && (
            <div className="p-3 space-y-3 animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-200 rounded-sm"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded w-full"></div>
              <div className="h-2 bg-gray-100 rounded w-2/3"></div>
              {/* Add a placeholder for the image to maintain height */}
              <div className="w-full h-[150px] bg-gray-100 rounded-t"></div>
            </div>
          )}

          {error && (
            <div className="p-3 space-y-3">
              <div className="flex items-center text-red-500 text-xs">
                <AlertCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="flex-1">{error}</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <button
                  onClick={handleRetry}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors duration-200"
                >
                  Retry
                </button>
                <button
                  onClick={handleEdit}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors duration-200"
                >
                  Edit URL
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-1 truncate">
                {details[0]}
              </div>
            </div>
          )}

          {metadata && !loading && !error && (
            <div className="flex flex-col h-full">
              {metadata.image && (
                <div className="w-full h-[150px] overflow-hidden relative bg-gray-50 rounded-t">
                  <Image
                    src={metadata.image}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    width={300}
                    height={150}
                    onError={() => {
                      /* Handle image error */
                    }}
                    style={{ transformOrigin: "center center" }}
                  />
                </div>
              )}

              <div className="p-3 space-y-2 flex-grow">
                <div className="flex items-start space-x-3">
                  {metadata.favicon && !faviconError ? (
                    <Image
                      src={metadata.favicon}
                      alt=""
                      className="w-5 h-5 mt-0.5 flex-shrink-0 object-contain"
                      onError={handleFaviconError}
                      width={20}
                      height={20}
                    />
                  ) : (
                    <div className="w-5 h-5 bg-gray-100 rounded-sm flex items-center justify-center flex-shrink-0">
                      <LinkIcon className="h-3 w-3 text-gray-400" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-gray-900 line-clamp-2">
                      {metadata.title || new URL(metadata.url).hostname}
                    </h3>
                    {metadata.description && (
                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                        {metadata.description}
                      </p>
                    )}
                    <div className="flex items-center mt-2 space-x-2">
                      <a
                        href={metadata.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-500 hover:text-indigo-600 flex items-center transition-colors duration-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLinkIcon className="h-3 w-3 mr-1" />
                        <span>Open</span>
                      </a>

                      <button
                        onClick={handleCopyLink}
                        className="text-xs text-gray-500 hover:text-gray-700 flex items-center transition-colors duration-200"
                      >
                        <ClipboardIcon className="h-3 w-3 mr-1" />
                        <span>{copied ? "Copied!" : "Copy"}</span>
                      </button>

                      <button
                        onClick={handleEdit}
                        className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 truncate">
                  {new URL(metadata.url).hostname}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default memo(LinkCard);
