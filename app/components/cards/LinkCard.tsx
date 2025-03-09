import { memo, useEffect, useState } from "react";
import { LinkIcon, AlertCircleIcon } from "lucide-react";
import Image from "next/image";

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

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchLinkMetadata = async (url: string) => {
      if (!url) return;

      try {
        setLoading(true);
        setError(null);
        setFaviconError(false);

        const response = await fetch(
          `/api/link-metadata?url=${encodeURIComponent(url)}`,
          {
            signal: controller.signal,
          }
        );

        if (!isMounted) return;

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Failed to fetch link metadata" }));
          throw new Error(errorData.error || "Failed to fetch link metadata");
        }

        const data = await response.json();
        if (isMounted) {
          setMetadata(data);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching link metadata:", err);
          setError(
            err instanceof Error ? err.message : "Failed to load link preview"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (details[0]) {
      fetchLinkMetadata(details[0]);
    } else {
      setMetadata(null);
      setError(null);
      setLoading(false);
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [details]);

  const handleFaviconError = () => {
    setFaviconError(true);
  };

  return (
    <div className="bg-white p-3 flex flex-col rounded border border-gray-200">
      {details[0] ? (
        <>
          {loading && (
            <div className="flex items-center space-x-3 animate-pulse">
              <div className="w-5 h-5 bg-gray-200 rounded-sm"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center text-red-500 text-xs">
              <AlertCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {metadata && !loading && !error && (
            <div className="flex flex-col">
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
                  <h3 className="font-medium text-sm text-gray-900 truncate">
                    {metadata.title || new URL(metadata.url).hostname}
                  </h3>
                  {metadata.description && (
                    <p className="text-xs text-gray-600 line-clamp-2 overflow-hidden">
                      {metadata.description}
                    </p>
                  )}
                  <a
                    href={metadata.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:underline mt-1 block truncate"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {new URL(metadata.url).hostname}
                  </a>
                </div>
              </div>
            </div>
          )}
        </>
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
              placeholder="Link title"
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
