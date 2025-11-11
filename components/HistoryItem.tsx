import React, { useState, useRef, useEffect } from 'react';
import { ChosenTitle } from '../App';
import CtrScore from './CtrScore';

interface HistoryItemProps {
  item: ChosenTitle;
  index: number;
  onUpdate: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
  onShare: () => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item, index, onUpdate, onDelete, onShare }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editText.trim() && editText.trim() !== item.title) {
      onUpdate(item.id, editText.trim());
    }
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditText(item.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-md">
      <div className="flex-shrink-0 flex items-center gap-4">
        <span className="text-xl font-bold text-slate-400 dark:text-slate-500 w-6 text-center">{index + 1}.</span>
        <CtrScore score={item.ctrScore} />
      </div>
      <div className="flex-grow min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleCancel}
            className="w-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        ) : (
          <p className="text-slate-800 dark:text-slate-200 font-semibold text-lg">{item.title}</p>
        )}
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 italic">"{item.description}"</p>
      </div>
      <div className="flex items-center space-x-2 flex-shrink-0">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              onMouseDown={(e) => e.preventDefault()} // Prevents onBlur from firing before click
              className="p-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors"
              aria-label="Save title"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onShare}
              className="p-2 rounded-md bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
              aria-label="Share title"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-md bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
              aria-label="Edit title"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 rounded-md bg-red-500/20 dark:bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/30 dark:hover:bg-red-500/40 transition-colors"
              aria-label="Delete title"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryItem;