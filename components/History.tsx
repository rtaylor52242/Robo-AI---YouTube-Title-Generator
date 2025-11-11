import React from 'react';
import HistoryItem from './HistoryItem';
import { ChosenTitle } from '../App';

interface HistoryProps {
  chosenTitles: ChosenTitle[];
  allChosenTitlesCount: number;
  onUpdateTitle: (id: string, newText: string) => void;
  onDeleteTitle: (id: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onShare: (text: string) => void;
  onShareAll: () => void;
}

const History: React.FC<HistoryProps> = ({ chosenTitles, allChosenTitlesCount, onUpdateTitle, onDeleteTitle, searchTerm, onSearchChange, onShare, onShareAll }) => {
  const showSearch = allChosenTitlesCount > 0;

  return (
    <div className="mt-8">
      <div className="max-w-3xl mx-auto mb-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Your Chosen Titles</h2>
            {allChosenTitlesCount > 0 && (
                <button
                    onClick={onShareAll}
                    className="flex items-center gap-2 text-sm font-semibold rounded-md py-2 px-4 transition-colors duration-200 bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200"
                    aria-label="Share all chosen titles"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                    Share All
                </button>
            )}
        </div>
      </div>
      
      {showSearch && (
        <div className="max-w-3xl mx-auto mb-6">
          <input
            type="text"
            placeholder="Search your chosen titles..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full p-3 bg-slate-100 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            aria-label="Search chosen titles"
          />
        </div>
      )}

      {allChosenTitlesCount === 0 ? (
        <div className="text-center bg-slate-100 dark:bg-slate-800 rounded-lg p-8 border border-dashed border-slate-300 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400">You haven't chosen any titles yet.</p>
          <p className="text-slate-400 dark:text-slate-500 mt-2 text-sm">Generate some titles and add your favorites here!</p>
        </div>
      ) : chosenTitles.length > 0 ? (
        <div className="space-y-4 max-w-3xl mx-auto">
          {chosenTitles.slice().reverse().map((item, index) => (
            <HistoryItem
              key={item.id}
              item={item}
              index={index}
              onUpdate={onUpdateTitle}
              onDelete={onDeleteTitle}
              onShare={() => onShare(item.title)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center bg-slate-100 dark:bg-slate-800 rounded-lg p-8 border border-dashed border-slate-300 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400">No titles found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default History;