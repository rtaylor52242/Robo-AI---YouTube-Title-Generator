import React, { useState, useEffect, useCallback } from 'react';

const Help: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeModal]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-6 right-20 p-2 rounded-full bg-slate-200/50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        aria-label="Show help"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {isOpen && (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center transition-opacity duration-300" 
            onClick={closeModal}
            aria-modal="true"
            role="dialog"
        >
          <div 
            className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8 m-4 max-w-2xl w-full z-50 transform transition-transform duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">How to Use This App</h2>
              <button onClick={closeModal} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label="Close help">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6 text-slate-600 dark:text-slate-300">
              <div>
                <h3 className="font-semibold text-lg text-slate-700 dark:text-slate-200 mb-2">1. Generate Titles</h3>
                <p>
                  Start by typing your content idea into the main text box on the <strong>Generator</strong> tab. Adjust the options below to tailor the results:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                  <li><strong>Tone:</strong> Choose the style you want, from Professional to Comical.</li>
                  <li><strong>Platform:</strong> Select where you'll be posting, like YouTube or a Blog.</li>
                  <li><strong>How many?:</strong> Decide how many title options you want (1-10).</li>
                  <li><strong>Include Emojis:</strong> Check this box to add relevant emojis to your titles.</li>
                </ul>
                <p className="mt-2">Once you're ready, click the <strong>Generate Titles</strong> button.</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-slate-700 dark:text-slate-200 mb-2">2. Review & Save</h3>
                <p>
                  The app will generate a list of titles. Each title card shows:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                  <li><strong>CTR Score:</strong> An estimated Click-Through Rate score (out of 100) to predict its performance. Higher is better!</li>
                  <li><strong>Description:</strong> A short explanation of why the title is effective.</li>
                  <li><strong>Actions:</strong> You can <strong>Save</strong> your favorite titles to the History tab, <strong>Copy</strong> a title to your clipboard, or <strong>Share</strong> it directly.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-slate-700 dark:text-slate-200 mb-2">3. Manage Your History</h3>
                <p>
                  Click on the <strong>History</strong> tab to see all your saved titles. Here you can:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                  <li><strong>Search:</strong> Quickly find a title using the search bar.</li>
                  <li><strong>Edit:</strong> Click the pencil icon to modify a title.</li>
                  <li><strong>Share or Delete:</strong> Use the buttons to share a single title or remove it from your list.</li>
                  <li><strong>Share All:</strong> Use the button at the top to share all your saved titles at once.</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 text-center">
                <button onClick={closeModal} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300">
                    Got it!
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Help;
