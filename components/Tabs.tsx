import React from 'react';

interface TabsProps {
  activeTab: 'generator' | 'history';
  setActiveTab: (tab: 'generator' | 'history') => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  const tabStyles = "px-6 py-3 font-semibold rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 focus:ring-indigo-500";
  const activeStyles = "bg-indigo-600 text-white shadow";
  const inactiveStyles = "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700";

  return (
    <div className="flex justify-center my-10">
      <div className="flex space-x-2 bg-slate-200 dark:bg-slate-800 p-2 rounded-xl border border-slate-300 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('generator')}
          className={`${tabStyles} ${activeTab === 'generator' ? activeStyles : inactiveStyles}`}
          aria-pressed={activeTab === 'generator'}
        >
          Generator
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`${tabStyles} ${activeTab === 'history' ? activeStyles : inactiveStyles}`}
          aria-pressed={activeTab === 'history'}
        >
          History
        </button>
      </div>
    </div>
  );
};

export default Tabs;
