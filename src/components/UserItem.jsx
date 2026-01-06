import { FiX, FiExternalLink } from 'react-icons/fi';

/**
 * Individual user item component with remove button
 */
export default function UserItem({ username, onRemove }) {
  const handleUsernameClick = (e) => {
    e.preventDefault();
    window.open(`https://www.instagram.com/${username}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex items-center justify-between p-3 bg-base-100 rounded-lg hover:bg-base-200 transition-colors duration-200 group">
      <a
        href={`https://www.instagram.com/${username}`}
        onClick={handleUsernameClick}
        className="text-base font-medium truncate flex-1 hover:text-primary transition-colors duration-200 flex items-center gap-2 cursor-pointer"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>{username}</span>
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

