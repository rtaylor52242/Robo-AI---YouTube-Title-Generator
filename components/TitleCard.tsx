import React, { useState } from 'react';

interface TitleCardProps {
  title: string;
  onChoose: (title: string) => void;
}

const TitleCard: React.FC<TitleCardProps> = ({ title, onChoose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(title).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 shadow-lg">
      <p className="text-slate-800 dark:text-slate-200 font-medium flex-1 pr-4">{title}</p>
      <div className="flex-shrink-0 flex items-center gap-2">
        <button
          onClick={() => onChoose(title)}
          className="w-24 text-sm font-semibold rounded-md py-2 px-3 transition-colors duration-200 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-500/20 dark:hover:bg-indigo-500/30 dark:text-indigo-300"
          aria-label={`Add title to history: ${title}`}
        >
          Add
        </button>
        <button
          onClick={handleCopy}
          className={`w-24 text-sm font-semibold rounded-md py-2 px-3 transition-colors duration-200 ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200'
          }`}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
};

export default TitleCard;
