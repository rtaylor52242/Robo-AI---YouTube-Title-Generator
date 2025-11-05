import React from 'react';
import HistoryItem from './HistoryItem';

interface ChosenTitle {
  id: string;
  text: string;
}

interface HistoryProps {
  chosenTitles: ChosenTitle[];
  allChosenTitlesCount: number;
  onUpdateTitle: (id: string, newText: string) => void;
  onDeleteTitle: (id: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const History: React.FC<HistoryProps> = ({ chosenTitles, allChosenTitlesCount, onUpdateTitle, onDeleteTitle, searchTerm, onSearchChange }) => {
  const showSearch = allChosenTitlesCount > 0;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-slate-200">Your Chosen Titles</h2>
      
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
          {chosenTitles.slice().reverse().map(item => (
            <HistoryItem
              key={item.id}
              item={item}
              onUpdate={onUpdateTitle}
              onDelete={onDeleteTitle}
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