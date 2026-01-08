import { useState, useEffect } from 'react';
import { FiX, FiExternalLink, FiUser } from 'react-icons/fi';
import { getAvatarUrl } from '../utils/avatar';

/**
 * Individual user item component with remove button and Instagram avatar
 */
export default function UserItem({ username, onRemove }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadAvatar = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        const url = await getAvatarUrl(username);
        if (isMounted) {
          if (url) {
            setAvatarUrl(url);
          } else {
            setHasError(true);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error(`Failed to load avatar for ${username}:`, error);
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    };

    loadAvatar();

    return () => {
      isMounted = false;
    };
  }, [username]);

  const handleUsernameClick = (e) => {
    e.preventDefault();
    window.open(`https://www.instagram.com/${username}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex items-center justify-between p-3 bg-base-100 rounded-lg hover:bg-base-200 transition-colors duration-200 group">
      <a
        href={`https://www.instagram.com/${username}`}
        onClick={handleUsernameClick}
        className="text-base font-medium truncate flex-1 hover:text-primary transition-colors duration-200 flex items-center gap-3 cursor-pointer min-w-0"
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* Avatar */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-base-300 flex items-center justify-center ring-2 ring-base-200">
          {isLoading ? (
            <div className="w-full h-full animate-pulse bg-gradient-to-br from-base-300 to-base-200" />
          ) : avatarUrl && !hasError ? (
            <img
              src={avatarUrl}
              alt={`${username}'s avatar`}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              width="40"
              height="40"
              onError={() => {
                setHasError(true);
                setAvatarUrl(null);
              }}
            />
          ) : (
            <FiUser className="text-base-content/40 text-lg" />
          )}
        </div>
        
        {/* Username */}
        <span className="truncate">{username}</span>
        
        <FiExternalLink className="text-sm opacity-0 group-hover:opacity-50 transition-opacity flex-shrink-0" />
      </a>
      <button
        onClick={() => onRemove(username)}
        className="ml-3 p-1.5 rounded-lg hover:bg-error/20 text-error hover:text-error transition-all duration-200 flex-shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label={`Remove ${username}`}
      >
        <FiX className="text-lg" />
      </button>
    </div>
  );
}

