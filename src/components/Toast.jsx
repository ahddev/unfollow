import { useEffect } from 'react';
import { FiAlertCircle, FiX } from 'react-icons/fi';

/**
 * Toast notification component for displaying errors and messages
 */
export default function Toast({ message, type = 'error', onClose, duration = 5000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const bgColor = type === 'error' ? 'bg-error' : 'bg-success';
  const textColor = type === 'error' ? 'text-error-content' : 'text-success-content';

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4 animate-slide-down`}>
      <div className={`${bgColor} ${textColor} rounded-xl shadow-lg p-4 flex items-center gap-3`}>
        <FiAlertCircle className="flex-shrink-0 text-xl" />
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Close"
        >
          <FiX className="text-xl" />
        </button>
      </div>
    </div>
  );
}

