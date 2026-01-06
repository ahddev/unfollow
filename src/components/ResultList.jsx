import { FiUsers, FiTrash2 } from 'react-icons/fi';
import UserItem from './UserItem';
import Skeleton from './Skeleton';

/**
 * Results list component displaying users who don't follow back
 */
export default function ResultList({ results, isLoading, onRemoveUser, onClearResults }) {
  if (isLoading) {
    return (
      <div className="card bg-base-200 shadow-md rounded-xl p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <FiUsers className="text-2xl text-primary" />
          <h2 className="text-xl font-bold">Results 🔥</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="card bg-base-200 shadow-md rounded-xl p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <FiUsers className="text-2xl text-primary" />
          <h2 className="text-xl font-bold">Results 🔥</h2>
        </div>
        <div className="text-center py-8 text-base-content/60">
          <p className="text-lg mb-2">🎉 All good!</p>
          <p>Everyone you follow also follows you back.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-200 shadow-md rounded-xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FiUsers className="text-2xl text-primary" />
          <h2 className="text-xl font-bold">
            Results 🔥
            <span className="ml-2 text-sm font-normal text-base-content/60">
              ({results.length} {results.length === 1 ? 'user' : 'users'})
            </span>
          </h2>
        </div>
        {onClearResults && (
          <button
            onClick={onClearResults}
            className="btn btn-sm btn-outline btn-error rounded-xl transition-all duration-200 hover:scale-105"
            type="button"
          >
            <FiTrash2 className="text-sm" />
            Clear Results
          </button>
        )}
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {results.map((username) => (
          <UserItem
            key={username}
            username={username}
            onRemove={onRemoveUser}
          />
        ))}
      </div>
    </div>
  );
}

