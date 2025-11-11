import React, { useState } from 'react';
import { TitleResponse } from '../services/geminiService';
import CtrScore from './CtrScore';

interface TitleCardProps {
  index: number;
  titleData: TitleResponse;
  onChoose: (titleData: TitleResponse) => void;
  isChosen: boolean;
  onShare: () => void;
}

const TitleCard: React.FC<TitleCardProps> = ({ index, titleData, onChoose, isChosen, onShare }) => {
  const [copied, setCopied] = useState(false);
  const { title, description, ctrScore } = titleData;

  const handleCopy = () => {
    navigator.clipboard.writeText(title).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-600">
      <div className="flex-shrink-0 flex items-center gap-4">
        <span className="text-2xl font-bold text-slate-400 dark:text-slate-500 w-6 text-center">{index + 1}.</span>
        <CtrScore score={ctrScore} />
      </div>
      <div className="flex-grow min-w-0">
        <p className="text-slate-800 dark:text-slate-200 font-semibold text-lg">{title}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 italic">"{description}"</p>
      </div>
      <div className="flex-shrink-0 flex items-center gap-2">
        <button
          onClick={() => onChoose(titleData)}
          disabled={isChosen}
          className={`w-24 text-sm font-semibold rounded-md py-2 px-3 transition-all duration-200 transform active:scale-95 ${
            isChosen
              ? 'bg-green-600 text-white cursor-default'
              : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-500/20 dark:hover:bg-indigo-500/30 dark:text-indigo-300'
          }`}
          aria-label={isChosen ? `Title already saved: ${title}` : `Save title: ${title}`}
        >
          {isChosen ? 'Saved' : 'Save'}
        </button>
        <button
          onClick={handleCopy}
          className={`w-24 text-sm font-semibold rounded-md py-2 px-3 transition-colors duration-200 transform active:scale-95 ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200'
          }`}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button
          onClick={onShare}
          className="p-2.5 rounded-md transition-colors duration-200 transform active:scale-95 bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200"
          aria-label="Share this title"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TitleCard;