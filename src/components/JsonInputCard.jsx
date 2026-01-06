import { useState, useEffect } from 'react';
import { FiUsers, FiUserCheck, FiClipboard, FiX } from 'react-icons/fi';
import { normalizeJsonInput } from '../utils/jsonParser';

/**
 * Reusable component for JSON input with validation
 */
export default function JsonInputCard({
  title,
  icon: Icon,
  placeholder,
  value,
  onChange,
  error,
  onValidationChange,
}) {
  const [localError, setLocalError] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    // Debounce validation
    const timer = setTimeout(() => {
      if (value.trim() === '') {
        setLocalError(null);
        onValidationChange?.(true);
        return;
      }

      setIsValidating(true);
      const result = normalizeJsonInput(value);
      setLocalError(result.error);
      onValidationChange?.(result.success);
      setIsValidating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [value, onValidationChange]);

  const displayError = error || localError;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch (err) {
      console.error('Failed to paste from clipboard:', err);
      // Fallback: show a message or try alternative method
      alert('Failed to paste from clipboard. Please paste manually (Cmd/Ctrl + V)');
    }
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="card bg-base-200 shadow-md rounded-xl p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4">
        {Icon && <Icon className="text-2xl text-primary" />}
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      
      <div className="form-control">
        <textarea
          className={`textarea textarea-bordered h-48 md:h-64 rounded-xl transition-all duration-200 ${
            displayError ? 'textarea-error' : 'focus:ring-2 focus:ring-primary'
          }`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        
        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={handlePaste}
            className="btn btn-sm btn-outline btn-primary rounded-xl flex-1 transition-all duration-200 hover:scale-105"
            type="button"
          >
            <FiClipboard className="text-sm" />
            Paste
          </button>
          <button
            onClick={handleClear}
            disabled={!value.trim()}
            className="btn btn-sm btn-outline btn-error rounded-xl flex-1 transition-all duration-200 hover:scale-105 disabled:opacity-50"
            type="button"
          >
            <FiX className="text-sm" />
            Clear
          </button>
        </div>
        
        {isValidating && (
          <div className="mt-2 text-sm text-base-content/60 flex items-center gap-2">
            <span className="loading loading-spinner loading-xs"></span>
            Validating...
          </div>
        )}
        
        {displayError && !isValidating && (
          <div className="mt-2 text-sm text-error flex items-center gap-2">
            <span>⚠️</span>
            <span>{displayError}</span>
          </div>
        )}
      </div>
    </div>
  );
}

